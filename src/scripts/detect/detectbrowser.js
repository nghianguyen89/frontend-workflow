
/***
 * Plugin Name  : CSS Browser Detector
 * Author       : Nghia Nguyen
 * Contact      : fb.com/nghianguyen1989
 ***/

/*
HISTORY :
 *** version 1.2 (Feb 12, 2026) : 
 *- detect mobile and tablet devices
 *- detect operating systems (Windows, macOS, Linux, Android, iOS)
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

function detectBrowser() {
    const ua = navigator.userAgent;
    const classList = [];

    // Detect browser engine
    const isWebKit = /AppleWebKit/i.test(ua) && !/Chrome/i.test(ua);
    const isBlink = /Chrome/i.test(ua) || /Edg/i.test(ua);
    const isGecko = /Gecko/i.test(ua) && !/like Gecko/i.test(ua);

    // Detect Internet Explorer (IE 6-11)
    if (/MSIE/i.test(ua)) {
        // IE 6-10
        classList.push('ie');
        const version = ua.match(/MSIE (\d+)/)?.[1];
        if (version) classList.push(`ie${version}`);
    } else if (/Trident/i.test(ua) && /rv:11/i.test(ua)) {
        // IE 11
        classList.push('ie', 'ie11');
    }
    // Detect Edge Legacy (EdgeHTML engine, before Chromium)
    else if (/Edge\//i.test(ua) && !/Edg\//i.test(ua)) {
        classList.push('edge', 'edge-legacy');
        const version = ua.match(/Edge\/(\d+)/)?.[1];
        if (version) classList.push(`edge${version}`);
    }
    // Detect Edge Chromium
    else if (/Edg\//i.test(ua)) {
        classList.push('edge', 'chromium-edge');
        const version = ua.match(/Edg\/(\d+)/)?.[1];
        if (version) classList.push(`edge${version}`);
    }
    // Detect Chrome
    else if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) {
        classList.push('chrome');
        const version = ua.match(/Chrome\/(\d+)/)?.[1];
        if (version) classList.push(`chrome${version}`);
    }
    // Detect Firefox
    else if (/Firefox/i.test(ua)) {
        classList.push('gecko', 'firefox');
        const version = ua.match(/Firefox\/(\d+)/)?.[1];
        if (version) classList.push(`firefox${version}`);
    }
    // Detect Safari
    else if (/Safari/i.test(ua) && isWebKit) {
        classList.push('webkit', 'safari');
        const version = ua.match(/Version\/(\d+)/)?.[1];
        if (version) classList.push(`safari${version}`);
    }
    // Detect Opera
    else if (/OPR\//i.test(ua) || /Opera/i.test(ua)) {
        classList.push('opera');
        const version = ua.match(/(?:OPR|Opera)\/(\d+)/)?.[1];
        if (version) classList.push(`opera${version}`);
    }

    // Detect mobile browsers
    if (/Mobile/i.test(ua) || /Android/i.test(ua)) {
        classList.push('mobile');
    }

    // Detect tablet
    if (/iPad/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua))) {
        classList.push('tablet');
    }

    // Detect OS
    if (/Mac OS X/i.test(ua)) classList.push('macos');
    else if (/Windows/i.test(ua)) classList.push('windows');
    else if (/Linux/i.test(ua)) classList.push('linux');
    else if (/Android/i.test(ua)) classList.push('android');
    else if (/iPhone|iPad|iPod/i.test(ua)) classList.push('ios');

    // Add classes to html element
    if (classList.length > 0) {
        document.documentElement.classList.add(...classList);
    }

    return classList.join(' ');
}

// Run on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', detectBrowser);
} else {
    detectBrowser();
}
