
/* reload page when change viewport between pc <=> smp */
(function ($) {
    var is_device, get_device;
    is_device = !is_smp ? 'is_pc' : 'is_smp';
    $(window).smartresize(function () {
        viewportW = $(window).width();
        get_device = !is_smp ? 'is_pc' : 'is_smp';
        if (is_device != get_device)
            window.location.href = window.location.href;
    });
})(jQuery);
