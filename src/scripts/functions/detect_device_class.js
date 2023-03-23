
/* detect device and add className to support layout (require detectmobile.js) */
(function ($) {

    if (MobileEsp.DetectIos()) $('html').addClass('ios');
    if (MobileEsp.DetectAndroid()) $('html').addClass('android');
    if (MobileEsp.DetectSmartphone()) $('html').addClass('smartphone');
    if (MobileEsp.DetectIphone()) return $('html').addClass('iphone');

    else if (MobileEsp.DetectIpad())
        return $('html').addClass('tabletdevice ipad');
    else if (MobileEsp.DetectAndroidPhone())
        return $('html').addClass('androidphone');
    else if (MobileEsp.DetectAndroidTablet())
        return $('html').addClass('tabletdevice androidtablet');
    return $('html').addClass('pc');

})(jQuery);
