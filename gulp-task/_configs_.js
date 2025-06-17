'use strict';

const project_name = 'c-unitsquare';
const project_cms = ''; // lancelot | wordpress | ec-cube |  default ('')

/* assets directory depend on project CMS */
let dir_css, dir_js, dir_image;

switch (project_cms) {
    case 'lancelot':
        dir_css = 'css';
        dir_js = 'js';
        dir_image = 'lancelot/common_files/images/public';
        break;
    case 'wordpress':
        dir_css = `themes/${project_name}/assets/css`;
        dir_js = `themes/${project_name}/assets/js`;
        dir_image = 'uploads';
        break;
    default:
        dir_css = 'assets/css';
        dir_js = 'assets/js';
        dir_image = 'assets/images';
}


module.exports = {
    source_dir: 'src',
    dist_dir: 'build',
    assets_dir: 'assets',
    dist: {
        css: dir_css,
        js: dir_js,
        image: dir_image,
    },
    browser_sync: {
        port: 4200,
        browsers: ['firefox'],
        use_https: false,
        ssl_cert: {
            key: 'C:/xampp/apache/conf/ssl.key/localhost.key',
            cert: 'C:/xampp/apache/conf/ssl.pem/localhost.pem',
        },
    },
};
