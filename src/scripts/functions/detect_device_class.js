
/* detect device and add className to support layout (require detectmobile.js) */
(function ($) {
    // smartphone
    if (MobileEsp.DetectSmartphone()) $('html').addClass('smartphone');
    // android
    if (MobileEsp.DetectAndroid()) $('html').addClass('android');
    // iphone
    if (MobileEsp.DetectIphone()) return $('html').addClass('iphone');
    // ios
    if (MobileEsp.DetectIos()) $('html').addClass('ios');

    if (MobileEsp.DetectIpad())
        return $('html').addClass('tabletdevice ipad');
    else if (MobileEsp.DetectAndroidTablet())
        return $('html').addClass('tabletdevice androidtablet');
    else if (MobileEsp.DetectAndroidPhone())
        return $('html').addClass('androidphone');
    return $('html').addClass('desktop');

})(jQuery);
