
/* device size class */
(function ($) {

    const breakpoints = {
        xs: 0,
        sm: 576,
        md: 768,
        lg: 992,
        xl: 1200,
        xxl: 1400
    }

    if (breakpoints.xs < viewportW && viewportW <= breakpoints.sm)
        return $('html').addClass('media-sm');
    else if (breakpoints.sm < viewportW && viewportW <= breakpoints.md)
        return $('html').addClass('media-md');
    else if (breakpoints.md < viewportW && viewportW <= breakpoints.lg)
        return $('html').addClass('media-lg');
    else if (breakpoints.lg < viewportW && viewportW <= breakpoints.xl)
        return $('html').addClass('media-xl');
    else
        return $('html').addClass('media-xxl');

})(jQuery);
