
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

    if (breakpoints.xs < __viewportW && __viewportW <= breakpoints.sm)
        return $('html').addClass('media-sm');
    else if (breakpoints.sm < __viewportW && __viewportW <= breakpoints.md)
        return $('html').addClass('media-md');
    else if (breakpoints.md < __viewportW && __viewportW <= breakpoints.lg)
        return $('html').addClass('media-lg');
    else if (breakpoints.lg < __viewportW && __viewportW <= breakpoints.xl)
        return $('html').addClass('media-xl');
    else
        return $('html').addClass('media-xxl');

})(jQuery);
