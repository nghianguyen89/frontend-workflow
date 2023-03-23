function get_anchor(t) {
    var o = header.length > 0 ? header.height() : 0,
        $ = void 0 !== t, i = $ ? t : window.location.href; if (-1 != i.search("#")) {
        var n = i.split("#")[0], e = "#" + i.split("#")[1]; "" != n && $ &&
            (window.location.href = n + e), 
            jQuery(e).length > 0 && setTimeout(function () { 
                jQuery("html, body").animate({ scrollTop: jQuery(e).offset().top - o - 20 }, 500) }, $ ? 0 : 500)
    }
}

/* scroll to anchor */
get_anchor();
var anchor_link = jQuery('.scrollTo');
anchor_link.on('click', function (e) {
    e.preventDefault();
    get_anchor(jQuery(this).attr('href'));
});