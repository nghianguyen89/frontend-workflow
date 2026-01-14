/*! *
 * global
 * !*/

let __domain_user, __project_name, __path_media;
let is_local, is_kariup, is_wordpress, is_lancelot = false;

__domain_user = window.location.origin;
__project_name = '';

if (typeof id_site !== 'undefined' && typeof id_contents !== 'undefined') {
    is_lancelot = true;
    __path_media = __domain_user + '/lancelot/common_files/images/public/';
} else if (typeof admin_url !== 'undefined' && typeof theme_url !== 'undefined') {
    is_wordpress = true;
    __path_media = site_url + '/wp-content/uploads/';
} else if (__domain_user.search('kariup.c-unit.co.jp') != -1) {
    is_kariup = true;
    __path_media = __domain_user + '/html/' + __project_name + '/assets/images/';
} else {
    is_local = true;
    if (__domain_user.search('cus-projects.local') != -1 || __domain_user.search('localhost') != -1)
        __path_media = __domain_user + '/assets/images/';
    else __path_media = 'assets/images/';
}

let __window = jQuery(window);
let __viewportW = jQuery(window).width();
let __viewportH = jQuery(window).height();
let __documentH = 0;
let __viewportSMP = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--cus-grid-breakpoints-smp'));
let __is_smp = __viewportW <= __viewportSMP ? true : false;
let __header = jQuery('#__header');
let __footer = jQuery('#__footer');

let __navbox = jQuery('.__header_menu');

/* shorthand console.log */
const log = console.log.bind(console);