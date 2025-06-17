jQuery(document).ready(function () {
    /*****
     * smartresize when resize screen
     *****/
    _window.smartresize(function () {
        /* re-calc viewport Width & Height */
        viewportW = _window.width();
        viewportH = _window.height();
    });

    /* header small */
    var header_scroll_class = '_small';
    jQuery(window).on('scroll', function (e) {
        if (jQuery(window).scrollTop() > 100)
            jQuery('#header').addClass(header_scroll_class);
        else jQuery('#header').removeClass(header_scroll_class);
    });

    /*! zoom img on SMP !*/
    var smp_zoom = jQuery('.smp_zoom');
    if (smp_zoom.length > 0 && viewportW <= viewportSMP) {
        smp_zoom.each(function () {
            jQuery(this).wrap('<a data-fancybox href="' + jQuery(this).attr('src') + '"></a>');
        });
    }

    /* check element in view */
    var in_view = jQuery('[class*="inview-"]');
    if (in_view.length > 0) {
        in_view.on('inview', function (event, isInView) {
            if (isInView)
                jQuery(this).addClass('inview-active');
        });
    }

    /* fancybox */
    Fancybox.bind("[data-fancybox]", {});

    /* WOW JS */
    new WOW().init();

    /* menu header */
    if (!is_smp) {
        jQuery(".global_navi > ul li").hover(
            function () { jQuery(this).find(".dropdown").stop(true, true).slideDown(300); },
            function () { jQuery(this).find(".dropdown").stop(true, true).slideUp(300); }
        );
    }

    /* main visual */
    setTimeout(function () {
        var main_visual = jQuery('.main_visual');
        if (main_visual.length > 0) {
            // background image
            var mainvisual_image = is_smp ? main_visual.data('imgsmp') : main_visual.data('imgpc');
            main_visual.css('background-image', 'url(' + mainvisual_image + ')');
        }
    }, 500);

    /* menu smp */
    if (is_smp) {
        var menu_smp = jQuery('.hamburger');
        menu_smp.on('click', function () {
            jQuery(this).toggleClass('is-active');
            jQuery('#header').toggleClass('is-open');
            jQuery(this).parents('.head_group_right').next().slideToggle(200);
        });

        jQuery('.global_navi a._trigger').on('click', function (e) {
            e.preventDefault();
            jQuery(this).toggleClass('is-open');
            jQuery(this).next().slideToggle(200);
        });
    }

    /* prevent click */
    jQuery('a._trigger[href="#"]').on('click', function (e) {
        e.preventDefault();
    });

    /* intro skip */
    var intro_skip = document.location.search.indexOf("skip");
    if (intro_skip !== -1) {
        document.querySelector("#intro").style.display = "none";
    }

});