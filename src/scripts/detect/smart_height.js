/*! smart_height - equal-height jQuery plugin.
 * Replaces jquery.heightLine.js (2013 Kazuma Nishihata, MIT-style license).
 * $('.card').smart_height({ itemPerRow: 3, device: 'pc' });
 * $('.grid').smart_height({ itemSelector: '.card' }); // Includes future children.
 * $('.card').smart_height('refresh');
 * $('.card').smart_height('destroy');
 * itemPerRow groups visible items in DOM order. Use disjoint groups.
 * Prefer CSS grid/flex stretch when items share a layout container.
 */
;(function ($) {
    'use strict';

    var controllers = new Set();
    var observed = new Map();
    var frame = null;
    var mutationObserver = null;
    var resizeObserver = null;
    var dataKey = 'smartHeightController';
    var mutationOptions = {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['class', 'style', 'hidden', 'src', 'srcset', 'sizes'],
    };

    function schedule() {
        if (!controllers.size || frame !== null) return;
        frame = window.requestAnimationFrame(flush);
    }

    function watchMutations() {
        if (mutationObserver && controllers.size) {
            mutationObserver.observe(document.documentElement, mutationOptions);
        }
    }

    function sizeOf(element) {
        var rect = element.getBoundingClientRect();
        return [rect.width, rect.height];
    }

    function flush() {
        frame = null;
        // Our own style/class writes must not schedule another measurement.
        if (mutationObserver) mutationObserver.disconnect();
        controllers.forEach(function (controller) { controller.measure(); });

        var nextObserved = new Map();
        controllers.forEach(function (controller) {
            controller.items.forEach(function (_, element) {
                if (!element.isConnected) return;
                nextObserved.set(element, sizeOf(element));
                // A fixed card height can hide changes in its children's size.
                element.querySelectorAll('*').forEach(function (child) {
                    nextObserved.set(child, sizeOf(child));
                });
            });
        });
        if (resizeObserver) {
            observed.forEach(function (_, element) {
                if (!nextObserved.has(element)) resizeObserver.unobserve(element);
            });
            nextObserved.forEach(function (_, element) {
                if (!observed.has(element)) resizeObserver.observe(element);
            });
        }
        // Compare against sizes AFTER writing heights to avoid feedback loops.
        observed = nextObserved;
        watchMutations();
    }

    function startWatching() {
        if (controllers.size !== 1) return;
        window.addEventListener('resize', schedule);
        window.addEventListener('load', schedule);
        document.addEventListener('DOMContentLoaded', schedule);
        // Capture also handles images inserted later, lazy images and failures.
        document.addEventListener('load', schedule, true);
        document.addEventListener('error', schedule, true);
        if (window.MutationObserver) {
            mutationObserver = new window.MutationObserver(schedule);
            watchMutations();
        }
        if (window.ResizeObserver) {
            resizeObserver = new window.ResizeObserver(function (entries) {
                if (entries.some(function (entry) {
                    var previous = observed.get(entry.target);
                    var current = sizeOf(entry.target);
                    return previous && (Math.abs(current[0] - previous[0]) > 0.1 ||
                        Math.abs(current[1] - previous[1]) > 0.1);
                })) schedule();
            });
        }
        if (document.fonts) {
            document.fonts.ready.then(schedule);
            document.fonts.addEventListener('loadingdone', schedule);
            document.fonts.addEventListener('loadingerror', schedule);
        }
    }

    function stopWatching() {
        if (controllers.size) return;
        if (frame !== null) window.cancelAnimationFrame(frame);
        frame = null;
        if (mutationObserver) mutationObserver.disconnect();
        if (resizeObserver) resizeObserver.disconnect();
        mutationObserver = resizeObserver = null;
        observed.clear();
        window.removeEventListener('resize', schedule);
        window.removeEventListener('load', schedule);
        document.removeEventListener('DOMContentLoaded', schedule);
        document.removeEventListener('load', schedule, true);
        document.removeEventListener('error', schedule, true);
        if (document.fonts) {
            document.fonts.removeEventListener('loadingdone', schedule);
            document.fonts.removeEventListener('loadingerror', schedule);
        }
    }

    function saveStyle(element, property) {
        return [element.style.getPropertyValue(property), element.style.getPropertyPriority(property)];
    }

    function restoreStyle(element, property, saved) {
        if (saved[0]) element.style.setProperty(property, saved[0], saved[1]);
        else element.style.removeProperty(property);
    }

    function Controller(target, options) {
        this.target = target;
        this.options = options;
        this.items = new Map();
        this.timer = null;
        this.destroyed = false;
        controllers.add(this);
        startWatching();
        this.refresh();
    }

    Controller.prototype.restore = function (element, saved) {
        restoreStyle(element, 'height', saved.height);
        if (this.options.supportTableCell) {
            restoreStyle(element, 'width', saved.width);
            restoreStyle(element, 'display', saved.display);
        }
        if (!saved.marker) element.classList.remove('is-smart-height');
    };

    Controller.prototype.enabled = function () {
        var width = document.documentElement.clientWidth;
        var options = this.options;
        if (width < options.minWidth || width > options.maxWidth) return false;
        if (options.device === 'both') return true;
        // Read current viewport and configured breakpoint, never a stale cached width.
        var breakpoint = typeof __viewportSMP !== 'undefined' ? __viewportSMP : NaN;
        if (!Number.isFinite(breakpoint)) {
            breakpoint = parseFloat(window.getComputedStyle(document.documentElement)
                .getPropertyValue('--cus-grid-breakpoints-smp'));
        }
        if (!Number.isFinite(breakpoint)) return false;
        return options.device === 'pc' ? width > breakpoint : width <= breakpoint;
    };

    Controller.prototype.measure = function () {
        if (this.destroyed) return;
        var self = this;
        var elements = this.options.itemSelector ? $(this.target).find(this.options.itemSelector).toArray() : this.target;
        var selected = new Set(elements);
        this.items.forEach(function (saved, element) {
            self.restore(element, saved);
            if (!selected.has(element)) self.items.delete(element);
        });
        elements.forEach(function (element) {
            if (!self.items.has(element)) {
                self.items.set(element, {
                    height: saveStyle(element, 'height'),
                    width: saveStyle(element, 'width'),
                    display: saveStyle(element, 'display'),
                    marker: element.classList.contains('is-smart-height'),
                });
            }
        });
        if (!this.enabled()) return;
        var visible = elements.filter(function (element) {
            return element.isConnected && element.getClientRects().length &&
                window.getComputedStyle(element).display !== 'none';
        });
        if (this.options.supportTableCell) {
            var widths = visible.map(function (element) { return $(element).width(); });
            visible.forEach(function (element, index) {
                $(element).width(widths[index]);
                element.style.display = 'table-cell';
            });
        }
        // Clear every old height before measuring so groups can shrink as well as grow.
        visible.forEach(function (element) { element.style.setProperty('height', 'auto'); });
        var rowSize = Math.floor(Number(this.options.itemPerRow));
        if (!(rowSize > 0)) rowSize = visible.length || 1;
        for (var index = 0; index < visible.length; index += rowSize) {
            var row = visible.slice(index, index + rowSize);
            var measurements = row.map(function (element) {
                var style = window.getComputedStyle(element);
                var extras = ['paddingTop', 'paddingBottom', 'borderTopWidth', 'borderBottomWidth']
                    .reduce(function (total, property) { return total + (parseFloat(style[property]) || 0); }, 0);
                return {
                    element: element,
                    height: $(element).outerHeight(),
                    extras: style.boxSizing === 'border-box' ? 0 : extras,
                };
            });
            var maximum = Math.max.apply(null, measurements.map(function (item) { return item.height; }));
            measurements.forEach(function (item) {
                item.element.style.setProperty('height', Math.max(0, maximum - item.extras) + 'px');
                item.element.classList.add('is-smart-height');
            });
        }
    };

    Controller.prototype.refresh = function () {
        if (this.destroyed) return;
        window.clearTimeout(this.timer);
        var delay = Math.max(0, Number(this.options.delayFunc) || 0);
        // Legacy delayFunc is a debounce, never an assumption about network speed.
        this.timer = delay ? window.setTimeout(schedule, delay) : null;
        if (!delay) schedule();
    };

    Controller.prototype.destroy = function () {
        if (this.destroyed) return;
        this.destroyed = true;
        window.clearTimeout(this.timer);
        var self = this;
        this.items.forEach(function (saved, element) {
            self.restore(element, saved);
            if ($.data(element, dataKey) === self) {
                $.removeData(element, dataKey);
            }
        });
        // An instance may be destroyed before its first animation frame.
        this.target.forEach(function (element) {
            if ($.data(element, dataKey) === self) {
                $.removeData(element, dataKey);
            }
        });
        this.items.clear();
        controllers.delete(this);
        stopWatching();
        schedule();
    };

    var defaults = {
        itemSelector: null,
        minWidth: 0,
        maxWidth: 10000,
        itemPerRow: 0,
        supportTableCell: false,
        device: 'both',
        delayFunc: 0,
    };

    $.fn.smart_height = function (options) {
        var existing = new Set();
        this.each(function () {
            var controller = $.data(this, dataKey);
            if (controller) existing.add(controller);
        });
        if (typeof options === 'string') {
            if (options !== 'refresh' && options !== 'destroy') {
                throw new Error('Unknown smart_height method: ' + options);
            }
            existing.forEach(function (controller) { controller[options](); });
            return this;
        }
        var settings = $.extend({}, defaults, options);
        if (settings.itemSelector !== null && typeof settings.itemSelector !== 'string') {
            throw new TypeError('smart_height itemSelector must be a CSS selector string.');
        }
        // Validate selectors before replacing a working instance.
        if (settings.itemSelector) $(this).find(settings.itemSelector);
        existing.forEach(function (controller) { controller.destroy(); });
        if (!this.length) return this;
        function create(elements) {
            var controller = new Controller(elements, settings);
            elements.forEach(function (element) { $.data(element, dataKey, controller); });
        }
        if (settings.itemSelector) {
            // Each container owns its own group and discovers new children on updates.
            this.each(function () { create([this]); });
        } else {
            create(this.toArray());
        }
        return this;
    };
})(jQuery);
