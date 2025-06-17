
/***
 * Plugin Name  : CSS Browser Detector
 * Author       : Nghia Nguyen
 * Contact      : fb.com/nghianguyen1989
 ***/

/*
HISTORY :
 *** version 1.1 (Jan 20, 2017) : 
 *- detect Microsoft Edge 
 *
 *** version 1.0 (Jul 02, 2014) : 
 *- detect IE browser : IE7,IE8,IE9,IE10,IE11
 *- detect Safari browser
 *- detect Chrome browser
 *- detect Firefox browser
 *- detect Opera browser
 *- detect browser engine (webkit/gecko)
 *

HOW TO USE :
 * Internet Explorer
 * |__IE7       :   .ie7 cssname{...}
 * |__IE8       :   .ie8 cssname{...}
 * |__IE9       :   .ie9 cssname{...}
 * |__IE10  :   .ie10 cssname{...}
 * |__IE11  :   .ie11 cssname{...}
 * |__All IE    :   .ie cssname{...}
 *
 * Microsoft Edge
 * |__.edge cssname{...}
 *
 * Safari
 * |__.safari cssname{...}
 *
 * Google Chrome
 * |__.chrome cssname{...}
 *
 * Mozilla Firefox
 * |__.firefox cssname{...}
 *
 * Browser Engine
 * |__.gecko cssname{...}
 * |__.webkit cssname{...}

*****************************************/

function detect_browser(u) {
    var ua = u.toLowerCase(),
        isIE11 = !!navigator.userAgent.match(/Trident.*rv\:11\./),
        isEdge = !!navigator.userAgent.match(/Edge/),
        isOpera = !!navigator.userAgent.match(/OPR/),
        is = function (t) {
            return ua.indexOf(t) > -1;
        },
        g = 'gecko',
        w = 'webkit',
        s = 'safari',
        arrClass = [
            !/opera|webtv/i.test(ua) && /msie\s(\d)/.test(ua)
                ? 'ie ie' + (!(RegExp.$1 == 1) ? RegExp.$1 : 10)
                : isEdge
                    ? ' edge'
                    : is('gecko/')
                        ? g + ' firefox'
                        : isOpera
                            ? ' opera'
                            : is('chrome')
                                ? w + ' chrome'
                                : is('applewebkit/')
                                    ? w + ' ' + s + (/version\/(\d+)/.test(ua) ? ' ' + s + RegExp.$1 : '')
                                    : is('mozilla/')
                                        ? isIE11
                                            ? 'ie ie11'
                                            : g
                                        : '',
        ];
    var c = arrClass.join(' ');
    document.documentElement.className += ' ' + c;
    return c;
}
detect_browser(navigator.userAgent);
