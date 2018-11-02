/**
 * Created by Quan on 2017/6/6.
 */

var ResolutionPolicy = {
    FIXED_WIDTH: 1,
    FIXED_HEIGHT: 2,
    NO_BORDER: 3
};

var Stage = function (id, option) {
    this.id = id || 'root';
    this.option = option || {};

    this.width = this.option.width || 640;
    this.height = this.option.height || 1008;
    this.designWidth = this.option.designWidth || this.width;
    this.designHeight = this.option.designHeight || this.height;
    this.safeWidth = this.option.safeWidth || this.width;
    this.safeHeight = this.option.safeHeight || this.height;
    this.zIndex = this.option.zIndex || 1;

    this.resolutionPolicy = this.option.resolutionPolicy || ResolutionPolicy.NO_BORDER;

    this.elementParent = this.option.parent || document.body;

    this.element = document.getElementById(this.id);

    this.resizeCallbackArr = [];
    this.resizeIntervalId = null;

    this.w = this.width;
    this.h = this.height;

    this.canResize = true;

    this.init();

    return this;
};

Stage.prototype = {

    init: function () {
        var self = this;

        this.setElement();

        this.resize();

        window.addEventListener('resize', function () {
            self.resize();
        });

        this.element.addEventListener('touchmove', function (e) {
            e.preventDefault();
        });
    },

    setElement: function () {
        if (!this.element) {
            this.element = document.createElement('div');
            this.element.id = this.id;
            this.elementParent.appendChild(this.element);
        }

        var style = this.element.style;
        style.position = 'absolute';
        // style.width = this.width + 'px';
        // style.height = this.height + 'px';
        style.top = 0;
        style.left = 0;
        style.zIndex = this.zIndex
    },

    setResizeCallback: function (callback) {
        if (typeof callback == 'function') {
            this.resizeCallbackArr.push(callback);
        }
    },

    resizeDelay: function () {
        var w = window.innerWidth;
        var h = window.innerHeight;

        // console.log('delay : ' + w + ' , ' + h);

        var style = this.element.style;

        var isWider = w / h > (w > h ? this.height / this.width : this.width / this.height);
        var isWidth = true;

        var policy_landscape = ResolutionPolicy.FIXED_WIDTH;
        var policy_portraint = ResolutionPolicy.FIXED_HEIGHT;

        if (this.resolutionPolicy instanceof Array) {
            policy_portraint = this.resolutionPolicy[0];
            policy_landscape = this.resolutionPolicy[1];
        } else {
            policy_portraint = this.resolutionPolicy;
            policy_landscape = this.resolutionPolicy;
        }

        var transform = '';

        if (w > h) {
            switch (policy_landscape) {
                case ResolutionPolicy.FIXED_WIDTH:
                    isWidth = true;
                    break;
                case ResolutionPolicy.FIXED_HEIGHT:
                    isWidth = false;
                    break;
                case ResolutionPolicy.NO_BORDER:
                    isWidth = isWider;
                    break;
                default:
            }

            if (isWidth) {
                // 横屏100%宽适配
                var ratio = w / this.height;
                this.w = this.height;
                this.h = h / ratio;
                transform = "rotate(90deg) translate(" + ((-this.width * ratio + h) / 2) + "px," + (-w) + "px) scale(" + ratio + ")";
            } else {
                // 横屏100%高适配
                var ratio = h / this.width;
                this.h = this.width;
                this.w = w / ratio;
                transform = "rotate(90deg) translate(0px," + (-w - this.height * ratio) / 2 + "px) scale(" + ratio + ")";
            }

        } else {
            switch (policy_portraint) {
                case ResolutionPolicy.FIXED_WIDTH:
                    isWidth = true;
                    break;
                case ResolutionPolicy.FIXED_HEIGHT:
                    isWidth = false;
                    break;
                case ResolutionPolicy.NO_BORDER:
                    isWidth = isWider;
                    break;
                default:
            }

            if (isWidth) {
                //竖屏100%宽适配
                var ratio = w / this.width;
                this.w = this.width;
                this.h = h / ratio;

                if (this.h < this.safeHeight) {
                    ratio = h / this.safeHeight;
                    this.h = this.safeHeight;
                    this.w = w / ratio;
                    transform = "translate(" + (w - this.designWidth * ratio) / 2 + "px," + -(this.designHeight - this.safeHeight) * ratio / 2 + "px) scale(" + ratio + ")";
                } else {
                    transform = "translate(" + -(this.designWidth - this.width) * ratio / 2 + "px," + (h - this.height * ratio) / 2 + "px) scale(" + ratio + ")";
                }
            } else {
                //竖屏100%高适配
                var ratio = h / this.height;
                this.h = this.height;
                this.w = w / ratio;
                if (this.w < this.safeWidth) {
                    ratio = w / this.safeWidth;
                    this.w = this.safeWidth;
                    this.h = h / ratio;
                    transform = "translate(" + -(this.designWidth - this.safeWidth) * ratio / 2 + "px," + (h - this.height * ratio) / 2 + "px) scale(" + ratio + ")";
                } else {
                    transform = "translate(" + (w - this.designWidth * ratio) / 2 + "px,0px) scale(" + ratio + ")";
                }
            }
        }

        style.transform = transform;
        style.webkitTransform = transform;
        style.transformOrigin = '0 0';
        style.webkitTransformOrigin = '0 0';

        for (var i = 0; i < this.resizeCallbackArr.length; i++) {
            var callback = this.resizeCallbackArr[i];
            callback && callback();
        }
    },

    resize: function () {
        var self = this;
        if (this.resizeIntervalId) clearTimeout(this.resizeIntervalId);

        if (!this.canResize) return;

        var w = window.innerWidth;
        var h = window.innerHeight;

        this.resizeIntervalId = setTimeout(function () {
            self.resizeDelay();
        }, 100);
    },

    setZ: function (index) {
        this.element.style.zIndex = index;
    },

    show: function () {
        this.element.style.display = 'block';
        this.element.style.opacity = 1;
    },

    hide: function () {
        this.element.style.display = 'none';
        this.element.style.opacity = 0;
    }
};