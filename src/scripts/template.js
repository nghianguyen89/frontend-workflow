jQuery(document).ready(function () {
    // Ensure _window is defined
    const _window = window._window || jQuery(window);
    let viewportW = _window.width();
    let viewportH = _window.height();

    // smartresize when resize screen
    if (typeof _window.smartresize === 'function') {
        _window.smartresize(function () {
            viewportW = _window.width();
            viewportH = _window.height();
        });
    } else {
        _window.on('resize', function () {
            viewportW = _window.width();
            viewportH = _window.height();
        });
    }

    // menu smp
    const header_scroll_class = '_small';

    // header small
    _window.on('scroll', function () {
        if (_window.scrollTop() > 100) {
            jQuery('#header').addClass(header_scroll_class);
        } else {
            jQuery('#header').removeClass(header_scroll_class);
        }
    });

    // scroll to top
    if (typeof jQuery.fn.toTopButton === 'function') {
        jQuery('body').toTopButton({
            imagePath: (typeof path_media !== 'undefined' ? path_media : '') + 'icons',
            arrowType: 'arrow-l',
            margin: 2,
            size: (typeof is_smp !== 'undefined' && is_smp) ? 2 : 4,
            backgroundColor: '#b3dfc8',
            linkClasses: [' scroll_totop'],
            mobileHide: 0
        });
    }

    // zoom img on SMP
    const smp_zoom = jQuery('.smp_zoom');
    if (
        smp_zoom.length > 0 &&
        typeof viewportSMP !== 'undefined' &&
        viewportW <= viewportSMP
    ) {
        smp_zoom.each(function () {
            const $img = jQuery(this);
            if (!$img.parent('a[data-fancybox]').length) {
                $img.wrap('<a data-fancybox href="' + $img.attr('src') + '"></a>');
            }
        });
    }

    // check element in view
    const in_view = jQuery('[class*="inview-"]');
    if (in_view.length > 0 && typeof in_view.on === 'function') {
        in_view.on('inview', function (event, isInView) {
            if (isInView) {
                jQuery(this).addClass('inview-active');
            }
        });
    }

    // fancybox
    if (typeof Fancybox !== 'undefined' && typeof Fancybox.bind === 'function') {
        Fancybox.bind("[data-fancybox]", {
            // Your custom options
        });
    }

    // main visual
    setTimeout(function () {
        const main_visual = jQuery('.main_visualbox__banner');
        if (main_visual.length > 0) {
            const mainvisual_image = (typeof is_smp !== 'undefined' && is_smp)
                ? main_visual.data('imgsmp')
                : main_visual.data('imgpc');
            if (mainvisual_image) {
                main_visual.css('background-image', 'url(' + mainvisual_image + ')');
            }
        }
    }, 500);
});

(function(window, undefined) {
    if (window.cus === undefined) {
        window.cus = {};
    }

    var cus = window.cus;
    window.cus = cus;

    

})(window);
