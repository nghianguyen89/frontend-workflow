
/*!--------------------------------------------------------------------------*
 *  
 *  jquery.heightLine.js
 *  
 *  MIT-style license. 
 *  
 *  2013 Kazuma Nishihata 
 *  http://www.to-r.net
 *  https://github.com/to-r/jquery.heightLine.js
 *  
 *--------------------------------------------------------------------------*/
;(function ($) {
    $.fn.heightLine = function () {
        var target = this,
            fontSizeChangeTimer,
            windowResizeId = Math.random();
        var heightLineObj = {
            op: {
                maxWidth: 10000,
                minWidth: 0,
                fontSizeCheck: false,
            },
            setOption: function (op) {
                this.op = $.extend(this.op, op);
            },
            destroy: function () {
                target.css('height', '');
            },
            create: function (op) {
                var self = this,
                    maxHeight = 0,
                    windowWidth = $(window).width();
                self.setOption(op);
                if (
                    windowWidth <= self.op.maxWidth &&
                    windowWidth >= self.op.minWidth
                ) {
                    target
                        .each(function () {
                            if ($(this).outerHeight() > maxHeight) {
                                maxHeight = $(this).outerHeight();
                            }
                        })
                        .each(function () {
                            var height =
                                maxHeight -
                                parseInt($(this).css('padding-top')) -
                                parseInt($(this).css('padding-bottom'));
                            $(this).height(height);
                        });
                }
            },
            refresh: function (op) {
                this.destroy();
                this.create(op);
            },
            removeEvent: function () {
                $(window).off('resize.' + windowResizeId);
                target.off('destroy refresh');
                clearInterval(fontSizeChangeTimer);
            },
        };
        if (typeof arguments[0] === 'string' && arguments[0] === 'destroy') {
            target.trigger('destroy');
        } else if (
            typeof arguments[0] === 'string' &&
            arguments[0] === 'refresh'
        ) {
            target.trigger('refresh');
        } else {
            heightLineObj['create'](arguments[0]);

            $(window).on('resize.' + windowResizeId, function () {
                heightLineObj['refresh']();
            });

            target
                .on('destroy', function () {
                    heightLineObj['removeEvent']();
                    heightLineObj['destroy']();
                })
                .on('refresh', function () {
                    heightLineObj['refresh']();
                });

            if (heightLineObj.op.fontSizeCheck) {
                if ($('#fontSizeChange').length <= 0) {
                    var fontSizeChange = $("<span id='fontSizeChange'></span>")
                        .css({
                            width: 0,
                            height: '1em',
                            position: 'absolute',
                            left: 0,
                            top: 0,
                        })
                        .appendTo('body');
                }
                var defaultFontSize = $('#fontSizeChange').height();
                fontSizeChangeTimer = setInterval(function () {
                    if (defaultFontSize != $('#fontSizeChange').height()) {
                        heightLineObj['refresh']();
                    }
                }, 100);
            }
        }
        return target;
    };
})(jQuery);




/* heightline advance */
function _heightline(settings) {

    // generate random ID string
    var id_hl = '_hl_' + Math.uuid(6, 16);

    // class
    var is_hl = '_is-hl';

    // default settings
    var defaultSettings = {
        itemClsName: '.hl',
        itemPerRow: 0,
        supportTableCell: false,
        device: 'both',
        delayFunc: 50,
    };

    // get settings
    var _settings = defaultSettings;
    for (var key in settings) {
        if (settings.hasOwnProperty(key))
            if (settings[key] !== undefined) _settings[key] = settings[key];
    }
    var _item = _settings.itemClsName,
        _number = _settings.itemPerRow,
        _supportTableCell = _settings.supportTableCell,
        _device = _settings.device,
        _delay = _settings.delayFunc;

    // process heightline if element exist
    if (jQuery(_item).length > 0) {
        jQuery(_item).on('inview', function (event, isInView) {
            if (isInView) {
                setTimeout(function () {
                    // heighline all item if itemPerRow = 0
                    if (_number == 0) {
                        if (
                            _device == 'both' ||
                            (_device == 'pc' && viewportW > viewportSMP) ||
                            (_device == 'smp' && viewportW <= viewportSMP)
                        ) {
                            // set height
                            jQuery(_item).removeClass(function (index, css) {
                                return (css.match(/\_hl_\S+/g) || []).join(' ');
                            }).css('height', 'auto').heightLine().addClass(is_hl);
                            // set width to support vertical-align width display:tale-cell
                            if (_supportTableCell)
                                jQuery(_item)
                                    .css('width', jQuery(_item).width())
                                    .css('display', 'table-cell');
                        }
                    } else {
                        // add class heightline
                        var count = 0,
                            row = 1;
                        jQuery(_item).each(function () {
                            count++;
                            jQuery(this).addClass(id_hl + '-' + row);
                            if (count >= _number) {
                                row++;
                                count = 0;
                            }
                        });
                        // calc rows number max
                        var totalItem = jQuery(_item).length;
                        var maxRow = Math.floor(
                            totalItem % _number > 0
                                ? totalItem / _number + 1
                                : totalItem / _number
                        );
                        // process heightline
                        for (var i = 1; i <= maxRow; i++) {
                            if (
                                _device == 'both' ||
                                (_device == 'pc' && viewportW > viewportSMP) ||
                                (_device == 'smp' && viewportW <= viewportSMP)
                            ) {
                                jQuery('.' + id_hl + '-' + i).removeClass(function (index, css) {
                                    return (css.match(/\_hl_\S+/g) || []).join(' ');
                                }).css('height', 'auto').heightLine().addClass(is_hl);
                                // set width to support vertical-align width display:tale-cell
                                if (_supportTableCell)
                                    jQuery('.' + id_hl + '-' + i)
                                        .css('width', jQuery(_item).width())
                                        .css('display', 'table-cell');
                            }
                        }
                    }
                }, _delay);
            }
        });
    }
}
