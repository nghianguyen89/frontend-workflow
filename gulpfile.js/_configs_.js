'use strict';

module.exports = {
    source_dir: 'src',
    dist_dir: 'build',
    browser_sync: {
        port: 4200,
        browsers: ['firefox'],
        use_https: true,
        ssl_cert: {
            key: 'C:/xampp/apache/conf/ssl.key/localhost.key',
            cert: 'C:/xampp/apache/conf/ssl.pem/localhost.pem',
        }
    }
}