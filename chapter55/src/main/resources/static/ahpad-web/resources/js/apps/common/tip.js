define(['jquery', 'fly'], function($, fly) {


    var Tip = function(options) {
        this.element = $('body');
        this.options = $.extend({}, {
            text: '',
            type: 'warning',
            delay: 3000
        }, options);
        this.init();
    };

    Tip.prototype = {

        constructor: Tip,

        init: function() {
            var self = this;
            options = $.extend({
                showInTop: true
            }, this.options || {});

            if (options.showInTop) {
                this.element = $('body', fly.top.document);
                $(window).unload(function() {
                    self.removeAll();
                });
            }

            this._create();

            this._init();

        },

        _create: function() {
            var flyTip = this.element.find('.fly-tip-wrap');
            if (flyTip.length) {
                flyTip.remove();
            }
            this.element = $('<div class="fly-tip-wrap"></div>').appendTo(
                this.element);
            this.tmpl = '<div class="fly-tip">' +
                '<i class="fly-tip-icon"></i>' +
                '<span class="fly-tip-content">' + this.options.text + '</span>' +
                '</div>';
        },

        _init: function() {
            var self = this;
            if (self.$tip && self.$tip.find('.fly-tip-content').text() == self.options
                .text) {
                self.$tip.stop();
            }
            this._addTip();
        },

        _addTip: function() {
            this.$tip = $(this.tmpl)
                .appendTo(this.element.empty())
                .addClass(this.options.type);

            this.$tip.css('marginLeft', 0 - this.$tip.width() / 2);

            this.$tip.delay(this.options.delay).fadeOut(1000, function() {
                $(this).remove();
            });
        },

        removeAll: function() {
            this.element.remove();
        }
    };

    return Tip;
});
