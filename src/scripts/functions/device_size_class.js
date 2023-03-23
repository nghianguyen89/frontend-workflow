
/* device size class */
(function ($) {

    if (!is_smp) return $('html').addClass('desktop');
    if (viewportW <= 380) return $('html').addClass('media-s');
    if (viewportW <= 600) return $('html').addClass('media-m');
    if (viewportW <= 800) return $('html').addClass('media-l');

})(jQuery);
