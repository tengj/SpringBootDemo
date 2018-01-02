define(['jquery'], function($){
    var mask = {
        
        init: function(options) {
            this.element = window.top.$('body');
            this.options = options || {
                content: '正在加载中...'
            },
            this.maskTpl();
            this.add();
        },

        maskTpl: function() {
            var str = 
            '<div class="fly-mask">' +
            '<div class="fly-mask-background"><iframe scrolling="no" frameborder="0"></iframe></div>' +
            '<div class="fly-mask-content">' +
            '<div><i></i><em>' + this.options.content + '</em></div></div></div>';
            this.maskElement = $(str);
        },
        
        _setOption: function( key, value ) {
            this._super(key, value);
            
            if(key == 'effect'){
                if(value == 'remove'){
                    this.remove();
                }
            } else if(key == 'content'){
                this.maskElement.find('em').html(value);
            }
        },

        //定位
        _position: function(){
            var width = this.element.outerWidth(),
                height = this.element.outerHeight(),
                position = 'absolute',
                $content = this.maskElement.children('.fly-mask-content');
            
            //对body遮罩时需要100%宽高
            if (this.element.is('body')){
                width = height = '100%';
                position = 'fixed';
            }
            
            this.maskElement.css({
                position: position,
                width: width,
                height: height
            });
            $content.css({
                marginLeft: 0 - $content.width() / 2,
                marginTop: 0 - $content.height() / 2
            });
        },
        
        add: function(){
            if(!this.maskElement.data('count')){
                this.element.addClass('fly-has-mask');
                this.maskElement.appendTo(this.element);
                this._position();
            }
            this._add();
        },
        
        remove: function(){
            this._remove();
            if(!this.maskElement.data('count')){
                this.element.removeClass('fly-has-mask');
                this.maskElement.remove();
            }
        },
        
        removeAll: function(){
            this.element.removeClass('fly-has-mask');
            this.maskElement.remove();
        },
        
        //计数器+1
        _add: function(){
            var num = this.maskElement.data('count') || 0;
            this.maskElement.data('count', num + 1);
        },
        
        //计数器-1
        _remove: function(){
            var num = this.maskElement.data('count') || 1;
            this.maskElement.data('count', num - 1);
        }
    };

    return mask;
});
