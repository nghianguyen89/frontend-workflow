function get_anchor(t) {
    if (typeof t !== 'undefined') {
        var target = t.replace('../', '');
    }

    var anchor_point = typeof target !== 'undefined' ? target : window.location.href;

    // scroll to id page
    if (anchor_point.search('#') != -1) {
        var a_target = '#' + anchor_point.split('#')[1];
        var headerH = jQuery('#header').length > 0 ? jQuery('#header').height() : 0;
        setTimeout(function () {
            jQuery('html, body').animate({
                scrollTop: jQuery(a_target).offset().top - headerH - 20
            }, 500);
        }, 500);
    }
}

/* scroll to anchor */
get_anchor();
var anchor_link = jQuery('.scrollTo');
anchor_link.on('click', function (e) {
    e.preventDefault();
    var this_target = jQuery(this).attr('href');
    var _href = this_target.split('#')[0];
    if (_href != window.location.href && _href != '')
        window.location.href = this_target;
    get_anchor(this_target);
});




// function scroll_anchor() {
//     // scroll to id page
//     var anchor_point = window.location.href;
//     if (anchor_point.search('#') != -1) {
//         var a_target = '#' + anchor_point.split('#')[1];
//         var headerH = jQuery('#header').length > 0 ? jQuery('#header').height() : 0;
//         setTimeout(function () {
//             jQuery('html, body').animate({
//                 scrollTop: jQuery(a_target).offset().top - headerH - 20
//             }, 500);
//         }, 500);
//     }

//     if (jQuery('.scrollTo').length > 0) {
//         jQuery('.scrollTo').each(function () {
//             jQuery(this).on('click', function (event) {
//                 event.preventDefault();
//                 var headerH = jQuery('#header').length > 0 ? jQuery('#header').height() : 0;
//                 var target = jQuery(this).attr('href');
//                 if (jQuery(target).length > 0) {
//                     jQuery('html, body').animate({
//                         scrollTop: jQuery(target).offset().top - headerH - 20
//                     }, 500);
//                 }
//             });
//         });
//     }
// }