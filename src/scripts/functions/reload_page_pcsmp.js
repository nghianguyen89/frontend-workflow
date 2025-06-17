
/* reload page when change viewport between pc <=> smp */
(function ($) {
    let viewportW = $(window).width();
    let viewportSMP = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--cus-grid-breakpoints-smp'));
    let is_device, get_device;
    is_device = viewportW > viewportSMP ? 'is_pc' : 'is_smp';

    $(window).smartresize(function () {

        viewportW = $(window).width();
        get_device = viewportW > viewportSMP ? 'is_pc' : 'is_smp';

        if (is_device != get_device)
            window.location.href = window.location.href;
    });
})(jQuery);
