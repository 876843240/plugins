var Keyboard = (function() {
    var defaultOpts = {
            contain: 'myText',
            readOnce: false, //是否键盘只生成一次
            container: document.body, //当前弹框存放的父元素
            layerColor: '#fff',
            layerOpacity: '0'
        }
        //合并两个对象的属性
        //并将两个对象中的属性合并到一个空对象中
    function combin(firstObj, secondObj) {
        var obj = {};
        for (var i in secondObj) {
            firstObj[i] = secondObj[i];
        }
        obj = firstObj;
        return obj;
    }

    function Keyboard(opts) {
        var opts = combin(defaultOpts, opts);
        this.firstClick = true;
        this.canInput = false;
        for (var i in opts) {
            this[i] = opts[i];
        }
        //可以支持同时在多个元素上绑定键盘
        var contain = this.contain;
        if (!!contain && typeof contain == 'object' && contain.length > 1) {
            var f = Array.prototype.slice.call(contain);
            for (var i = 0, j = f.length; i < j; i++) {
                if (typeof f[i] == 'object' && f[i].nodeType == 1) {
                    eleBindEvent.call(this, f[i]);
                } else {
                    eleBindEvent.call(this, document.getElementById(f[i]));
                }

            }
        } else {
            eleBindEvent.call(this, document.getElementById(contain));
        }
    }
    /*
     *每次在元素上点击时的事件
     */
    function eleBindEvent(bindEle) {
        var that = this;
        bindEvent('touchend', function() {
            that.bindEle = bindEle;
            if (that.readOnce) {
                if (that.firstClick) {
                    that.init();
                    that.firstClick = false;
                }

            } else {
                that.init();
            }
        }, bindEle);
    }
    /*
     *绑定事件的函数
     *不提供ie下的事件绑定
     */
    function bindEvent(eventType, fn, obj) {
        if (window.addEventListener) {
            return binEvent = (function() {
                obj.addEventListener(eventType, fn, false);
            })();
        } else {
            return binEvent = (function() {
                obj['on' + eventType] = fn;
            })();
        }
    }
    Keyboard.prototype = {
        constructor: Keyboard,
        /*
         *初始化方法
         */
        init: function() {
            var container = this.container,
                keyPlace = this.createBoard(),
                overlay = document.createElement('div');
            this.bindEle.blur();
            overlay.className = 'overlay';

            overlay.style.opacity = this.layerOpacity;
            overlay.style.backgroundColor = this.layerColor;
            var type = this.bindEle.type;
            /*绑定弹框的元素类型必须为text||tel||number||email时，才可以正常弹出*/
            if (type == 'text' || type == 'tel' || type == 'number' || type == 'email') {
                this.multiClass([keyPlace, overlay], 'show-obj', 'addClass');
                this.clickEvent(keyPlace, overlay);
                container.appendChild(keyPlace);
                container.appendChild(overlay);
            }
        },
        /*
         *所有的键盘和弹出层点击事件
         */
        clickEvent: function(keyPlace, overlay) {
            var contain = this.bindEle,
                _self = this,
                type = contain.type;
            //键盘按键点击事件
            bindEvent('touchend', function(e) {
                var e = e || window.event,
                    target = e.target,
                    dataType = e.target.getAttribute('data-type'),
                    valueLen;
                e.stopPropagation();
                //如果按下的是数字键
                //则将当前数字加入到输入框中
                if (dataType == 'input-num') {
                    contain.value += target.getAttribute('data-num');
                    //如果是取消按钮。则让当前输入数字减少一位
                } else if (dataType == 'input-del'||_self.hasClass(target,'icon-cha')) {
                    valueLen = contain.value.length;
                    console.log('aaaa');
                    contain.value = contain.value.substr(0, valueLen - 1);
                    //如果是确定按钮，则让当前弹窗隐藏
                } else if (dataType == 'input-sure'||_self.hasClass(target,'icon-chenggong')) {
                    _self.hideObj(keyPlace, overlay);
                }
                //如果是确定键
            }, keyPlace);
            //弹出层被点击时候的事件
            bindEvent('touchend', function(e) {
                var target = e.target,
                    eventType;
                if (target.id == _self.selector) {
                    eventType = 'addClass';
                    _self.removeClass(keyPlace, 'hide-obj');
                    _self.multiClass([keyPlace, overlay], 'show-obj', eventType);
                } else if (target == overlay && _self.hasClass(target,'show-obj')) {

                    _self.hideObj(keyPlace, overlay);
                } else {
                    return false;
                }

            }, document.body);
        },
        //当前函数用来生成12个按键
        //按键的按钮单独生成
        createDom: function() {
            var inner = '',
                m, s, type, icon; //当前按钮的内容,type参数表示当前按钮是
            //用来输入数字还是进行相应的功能
            //调用随机排序方法对当前的键进行随机排序
            if (this.readOnce) {
                m = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
            } else {
                m = this.randomSortNum([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
            }
            for (var i = 0; i < 12; i++) {
                //根据不同的键生成内容
                if (i == 9) {
                    s = "确定";
                    type = "input-sure";
                    icon = 'iconfont icon-chenggong';
                } else if (i == 11) {
                    s = "取消";
                    type = "input-del";
                    icon = 'iconfont icon-cha';
                } else if (i == 10) {
                    s = m[9];
                    type = "input-num";
                    icon = ' ';
                } else {
                    s = m[i];
                    type = "input-num";
                    icon = ' ';
                }
                inner += '<a href="javascript:void(0);" role="button" data-num="' + s + '" data-type=' + type + ' class="key-btn"><span  class="' + icon + '"></span>' + s + '</a>';
            }
            return inner;
        },
        //在当前按钮上创建键的显示内容
        createBoard: function() {
            var keys = [], //用来生成所有的键的内容
                keyContain = document.createElement('div'),
                btns;
            keyContain.className = 'main-key-contain';
            keyContain.innerHTML = this.createDom();
            return keyContain;
        },
        //对元素class进行处理
        toggleClass: function(obj, cls) {
            if (obj.className.indexOf(cls) < 0) {
                this.addClass(obj, cls);
            } else {
                this.removeClass(obj, cls);
            }
            return this;
        },
        //隐藏当前的键盘
        hideObj: function(keyPlace, overlay) {
            var _self = this;
            this.addClass(keyPlace, 'hide-obj');
            if (!this.readOnce) {
                setTimeout(function() {
                    _self.container.removeChild(keyPlace);
                    _self.container.removeChild(overlay);
                }, 600);
            } else {
                setTimeout(function() {
                    _self.multiClass([overlay, keyPlace], 'show-obj', 'removeClass');
                }, 600);
            }
        },
        hasClass:function(target,cls){
            return target.className.match(cls);
        },
        addClass: function(obj, cls) {
            obj.className += ' ' + cls;
            return this;
        },
        //多个元素同时绑定事件
        multiClass: function(objArr, cls, fnName) {
            for (var i = 0, j = objArr.length; i < j; i++) {
                this[fnName](objArr[i], cls);
            }
        },
        isArray: function(para) {
            return Object.prototype.toString.call(para) == '[object Array]';
        },
        removeClass: function(obj, cls) {
            obj.className = obj.className.replace(' ' + cls, "");
            return this;
        },
        //将任意个数字随机进行排序
        //传入参数为一个数组
        randomSortNum: function(numarr) {
            var type = Object.prototype.toString.call(numarr),
                ret = numarr,
                len;
            if (type.indexOf('object') < 0) {
                console.log('this is not a array');
                return false;
            } else if (type == '[object Object]') {
                try {
                    for (var i in numarr) {
                        ret[i] = numarr[i];
                    }

                } catch (e) {
                    throw new Error('can\'t change this parameters');
                }
            }
            //排序用函数。
            //思想是每次在前len-i个数中随机一个
            //用这个数与这len-i个数中的最后一个数交换位置
            for (var i = 0, len = ret.length; i < len - 1; i++) {
                var idx = Math.floor(Math.random() * (len - i)),
                    temp = ret[idx];
                ret[idx] = ret[len - i - 1];
                ret[len - i - 1] = temp;
            }
            return ret;
        }
    }
    return function(opts) {
        return new Keyboard(opts);
    };
})();
