
/* reload page when change viewport between pc <=> smp */
(function ($) {
    let __viewportW = $(window).width();
    let __viewportSMP = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--cus-grid-breakpoints-smp'));
    let is_device, get_device;
    is_device = __viewportW > __viewportSMP ? 'is_pc' : '__is_smp';

    $(window).smartresize(function () {

        __viewportW = $(window).width();
        get_device = __viewportW > __viewportSMP ? 'is_pc' : '__is_smp';

        if (is_device != get_device)
            window.location.href = window.location.href;
    });
})(jQuery);
