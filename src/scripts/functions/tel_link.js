
/* set tel link for text-tel when mobile */
(function ($) {

    var ua = navigator.userAgent;
    if (
        is_smp ||
        MobileEsp.DetectIos() || 
        MobileEsp.DetectAndroid() || 
        MobileEsp.DetectSmartphone()
    ) {
        $('.tel-link img').each(function () {
            var alt = $(this).attr('alt');
            $(this).wrap(
                $('<a>').attr('href', 'tel:' + alt.replace(/-/g, ''))
            );
        });
        $('.tel-text').each(function () {
            var txt = $(this).html();
            $(this).wrap(
                $('<a>').attr('href', 'tel:' + txt.replace(/-/g, ''))
            );
        });
        $('.fax-text').each(function () {
            if ($(this).parent().is('a')) $(this).unwrap();
        });
    }

})(jQuery);
