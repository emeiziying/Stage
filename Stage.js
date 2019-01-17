/**
 * Created by Quan on 2017/6/6.
 */

var ResolutionPolicy = {
    FIXED_WIDTH: 1,
    FIXED_HEIGHT: 2,
    NO_BORDER: 3
};

var OrientationPolicy = {
    LANDSCAPE: 1,
    PORTRAIT: 2,
    AUTO: 3
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

    this.orientationPolicy = this.option.orientation || OrientationPolicy.AUTO;
    this.resolutionPolicy = this.option.resolution || ResolutionPolicy.NO_BORDER;

    this.elementParent = this.option.parent || document.body;

    this.element = document.getElementById(this.id);

    this.resizeCallbackArr = [];
    this.resizeIntervalId = null;

    this.w = this.width;
    this.h = this.height;
    this.s = 1;

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
        style.top = '0';
        style.left = '0';
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

        var style = this.element.style;

        var isWider = w / h > (w > h ? this.height / this.width : this.width / this.height);
        var isWidth = true;

        var policy_landscape = ResolutionPolicy.FIXED_WIDTH;
        var policy_portrait = ResolutionPolicy.FIXED_HEIGHT;

        if (this.resolutionPolicy instanceof Array) {
            policy_portrait = this.resolutionPolicy[0];
            policy_landscape = this.resolutionPolicy[1];
        } else {
            policy_portrait = this.resolutionPolicy;
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
                this.s = w / this.height;
                this.w = this.height;
                this.h = h / this.s;
                if (this.h < this.safeWidth) {
                    this.s = h / this.safeWidth;
                    this.h = this.safeWidth;
                    this.w = w / this.s;
                }
            } else {
                // 横屏100%高适配
                this.s = h / this.width;
                this.h = this.width;
                this.w = w / this.s;
                if (this.w < this.safeHeight) {
                    this.s = w / this.safeHeight;
                    this.w = this.safeHeight;
                    this.h = h / this.s;
                }
            }

            transform = "rotate(-90deg) translate(" + (-(this.h + this.designWidth) * this.s / 2) + "px," + (this.w - this.designHeight) * this.s / 2 + "px) scale(" + this.s + ")";
        } else {
            switch (policy_portrait) {
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
                this.s = w / this.width;
                this.w = this.width;
                this.h = h / this.s;
                if (this.h < this.safeHeight) {
                    this.s = h / this.safeHeight;
                    this.h = this.safeHeight;
                    this.w = w / this.s;
                }
            } else {
                //竖屏100%高适配
                this.s = h / this.height;
                this.h = this.height;
                this.w = w / this.s;
                if (this.w < this.safeWidth) {
                    this.s = w / this.safeWidth;
                    this.w = this.safeWidth;
                    this.h = h / this.s;
                }
            }

            transform = "translate(" + (this.w - this.designWidth) * this.s / 2 + "px," + (this.h - this.designHeight) * this.s / 2 + "px) scale(" + this.s + ")";
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
        this.resizeIntervalId = setTimeout(function () {
            self.resizeDelay();
        }, 100);
    },

    setResize: function (canResize) {
        this.canResize = !!canResize;
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