'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

test('Gulp watch discovers JS files, preserves CLI plugins and maps SCSS', { timeout: 90000 }, async (t) => {
    const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'workflow-watch-'));
    for (const rel of ['gulp-task', 'src/scripts', 'src/styles', 'src/views']) {
        fs.cpSync(path.join(root, rel), path.join(fixture, rel), { recursive: true });
    }
    for (const rel of ['gulpfile.js', 'vite.config.mjs', 'package.json', 'postcss.config.cjs']) {
        fs.copyFileSync(path.join(root, rel), path.join(fixture, rel));
    }
    fs.symlinkSync(path.join(root, 'node_modules'), path.join(fixture, 'node_modules'), process.platform === 'win32' ? 'junction' : 'dir');

    let output = '';
    let spawnError;
    const child = spawn(process.execPath, ['node_modules/gulp/bin/gulp.js', 'watch', '--dev', '--plugins=jquery'], {
        cwd: fixture, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'],
    });
    child.stdout.on('data', (data) => { output += data; });
    child.stderr.on('data', (data) => { output += data; });
    child.on('error', (error) => { spawnError = error; });
    t.after(async () => {
        if (child.exitCode === null && child.pid) {
            if (process.platform === 'win32') {
                spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], { windowsHide: true });
            } else {
                child.kill('SIGTERM');
            }
            await delay(300);
        }
        assert.equal(path.dirname(fixture), os.tmpdir());
        fs.rmSync(fixture, { recursive: true, force: true });
    });

    function read(rel) {
        const file = path.join(fixture, rel);
        return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
    }
    async function until(check) {
        const deadline = Date.now() + 20000;
        while (Date.now() < deadline) {
            if (spawnError) throw spawnError;
            if (child.exitCode !== null) throw Error(output);
            if (check()) return;
            await delay(100);
        }
        assert.fail('Watch rebuild timed out:\n' + output.slice(-6000));
    }

    const js = 'dist/assets/js/bundle.min.js';
    const css = 'dist/assets/css/styles.min.css';
    await until(() => read(css + '.map') && read(js + '.map'));
    const jsMap = JSON.parse(read(js + '.map'));
    assert.ok(jsMap.sources.some((source) => source.includes('jquery')));
    assert.ok(!jsMap.sources.some((source) => source.includes('@fancyapps/ui')));

    const initialJs = read(js);
    const styleFile = path.join(fixture, 'src/styles/styles.scss');
    const originalStyles = fs.readFileSync(styleFile, 'utf8');
    fs.appendFileSync(styleFile, '\n.workflow-map-probe { color: rgb(12, 34, 56); }\n');
    await until(() => read(css).includes('.workflow-map-probe') && read(css + '.map').includes('workflow-map-probe'));
    await delay(300);
    assert.equal(read(js), initialJs);

    const trace = require(require.resolve('@jridgewell/trace-mapping', {
        paths: [path.join(root, 'node_modules/.pnpm/node_modules')],
    }));
    const generatedCss = read(css);
    const index = generatedCss.indexOf('.workflow-map-probe');
    const prefix = generatedCss.slice(0, index);
    const origin = trace.originalPositionFor(trace.AnyMap(JSON.parse(read(css + '.map'))), {
        line: prefix.split('\n').length,
        column: index - prefix.lastIndexOf('\n') - 1,
    });
    assert.ok(origin.source.endsWith('/src/styles/styles.scss'));
    assert.equal(origin.line, originalStyles.split('\n').length + 1);

    const page = path.join(fixture, 'src/scripts/pages/watch-probe/nested.js');
    fs.mkdirSync(path.dirname(page), { recursive: true });
    fs.writeFileSync(page, 'window.workflowWatchProbe = 101;\n');
    await until(() => read(js).includes('workflowWatchProbe = 101'));
    fs.writeFileSync(page, 'window.workflowWatchProbe = 202;\n');
    await until(() => read(js).includes('workflowWatchProbe = 202'));
    fs.unlinkSync(page);
    await until(() => !read(js).includes('workflowWatchProbe'));

    fs.writeFileSync(path.join(fixture, 'src/views/watch-probe.pug'), 'p workflow-pug-probe\n');
    await until(() => read('dist/watch-probe.html').includes('workflow-pug-probe'));
});
