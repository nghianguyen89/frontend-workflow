'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');

test('BrowserSync injects CSS and reloads only for changed JS contents', (t) => {
    const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'workflow-reload-'));
    const jsDir = path.join(fixture, 'assets', 'js');
    fs.mkdirSync(jsDir, { recursive: true });
    const js = path.join(jsDir, 'bundle.min.js');
    fs.writeFileSync(js, 'window.example = 1;');
    let options;
    let reloads = 0;
    const server = { init(value) { options = value; }, reload() { reloads++; } };
    const context = {
        module: { exports: {} },
        require(name) {
            if (name === './_configs_') return {
                dist_dir: fixture, assets_dir: 'assets',
                browser_sync: { port: 4200, browsers: [], use_https: false },
            };
            if (name === 'browser-sync') return { create: () => server };
            return require(name);
        },
    };
    vm.runInNewContext(fs.readFileSync(path.join(root, 'gulp-task/browser-sync.js'), 'utf8'), context);
    t.after(() => {
        assert.equal(path.dirname(fixture), os.tmpdir());
        fs.rmSync(fixture, { recursive: true, force: true });
    });
    context.module.exports.start();
    const watch = options.files.find((item) => typeof item === 'object');
    assert.ok(options.files.some((item) => typeof item === 'string' && item.endsWith('/css/**/*.css')));
    assert.ok(!options.files.some((item) => typeof item === 'string' && (item.endsWith('/**') || item.includes('.html') || item.includes('.map'))));
    assert.equal(watch.options.ignoreInitial, true);

    // Vite rewrites JS after an SCSS edit without changing its bytes.
    fs.writeFileSync(js, 'window.example = 1;');
    watch.fn('change', js);
    assert.equal(reloads, 0);
    fs.writeFileSync(js, 'window.example = 2;');
    watch.fn('change', js);
    assert.equal(reloads, 1);
    watch.fn('change', js);
    assert.equal(reloads, 1);

    const added = path.join(jsDir, 'extra.js');
    fs.writeFileSync(added, 'window.extra = true;');
    watch.fn('add', added);
    assert.equal(reloads, 2);
    fs.unlinkSync(added);
    watch.fn('unlink', added);
    assert.equal(reloads, 3);
    watch.fn('unlink', added);
    assert.equal(reloads, 3);
});

test('fragment and relative anchors resolve against the current nested page', () => {
    const location = { href: 'https://example.test/company/about.html', origin: 'https://example.test', pathname: '/company/about.html', hash: '' };
    let scrolls = 0;
    let prevented = 0;
    const context = {
        URL,
        window: { location, pageYOffset: 0, scrollTo() { scrolls++; } },
        document: {
            addEventListener() {},
            querySelector(selector) {
                if (selector === '#details') return { getBoundingClientRect: () => ({ top: 120 }) };
                return null;
            },
        },
        history: { replaceState() {} },
    };
    vm.runInNewContext(fs.readFileSync(path.join(root, 'src/scripts/functions/scroll_to.js'), 'utf8'), context);
    for (const href of ['#details', './about.html#details']) {
        context.handleAnchorClick({ currentTarget: { getAttribute: () => href }, preventDefault() { prevented++; } });
        assert.equal(location.href, 'https://example.test/company/about.html');
    }
    assert.equal(prevented, 2);
    assert.equal(scrolls, 2);
    context.handleAnchorClick({ currentTarget: { getAttribute: () => '../contact.html#details' }, preventDefault() { prevented++; } });
    assert.equal(location.href, 'https://example.test/contact.html#details');
    assert.equal(prevented, 2);
});
