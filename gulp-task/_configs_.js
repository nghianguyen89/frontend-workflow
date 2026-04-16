'use strict';

const project_name = 'wp_themes';
const project_cms = 'wordpress'; // lancelot | wordpress | ec-cube |  default ('')

/* assets directory depend on project CMS */
let dir_css, dir_js, dir_image;

switch (project_cms) {
    case 'lancelot':
        dir_css = 'css';
        dir_js = 'js';
        dir_image = 'lancelot/common_files/images/public';
        break;
    case 'wordpress':
        dir_css = `_cms_/${project_name}/assets/css`;
        dir_js = `_cms_/${project_name}/assets/js`;
        dir_image = 'uploads';
        break;
    default:
        dir_css = 'assets/css';
        dir_js = 'assets/js';
        dir_image = 'assets/images';
}


module.exports = {
    project_name: project_name,
    source_dir: 'src',
    dist_dir: 'dist',
    assets_dir: 'assets',
    dist: {
        css: dir_css,
        js: dir_js,
        image: dir_image,
    },
    browser_sync: {
        port: 4200,
        browsers: ['firefox'], // ['firefox', 'chrome', 'edge']
        use_https: false,
        ssl_cert: {
            key: 'C:/xampp/apache/conf/ssl.key/localhost.key',
            cert: 'C:/xampp/apache/conf/ssl.pem/localhost.pem',
        },
    },
};
