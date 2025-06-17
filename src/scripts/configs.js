/*! *
 * global
 * !*/

let domain_user, project_name, path_media;
let is_local, is_kariup, is_wordpress, is_lancelot = false;

domain_user = window.location.origin;
project_name = '';

if (typeof id_site !== 'undefined' && typeof id_contents !== 'undefined') {
    is_lancelot = true;
    path_media = domain_user + '/lancelot/common_files/images/public/';
} else if (typeof admin_url !== 'undefined' && typeof theme_url !== 'undefined') {
    is_wordpress = true;
    path_media = site_url + '/wp-content/uploads/';
} else if (domain_user.search('kariup.c-unit.co.jp') != -1) {
    is_kariup = true;
    path_media = domain_user + '/html/' + project_name + '/assets/images/';
} else {
    is_local = true;
    if (domain_user.search('cus-projects.local') != -1 || domain_user.search('localhost') != -1)
        path_media = domain_user + '/assets/images/';
    else path_media = 'assets/images/';
}

let _window = jQuery(window);
let viewportW = jQuery(window).width();
let viewportH = jQuery(window).height();
let documentH = 0;
let viewportSMP = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--cus-grid-breakpoints-smp'));
let is_smp = viewportW <= viewportSMP ? true : false;
let header = jQuery('#header');
let footer = jQuery('#footer');

let navbox = jQuery('.header_menu');

/* shorthand console.log */
const log = console.log.bind(console);