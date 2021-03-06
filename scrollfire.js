module.exports = {
  props: {
    multiple: {
      type: Boolean,
      "default": false
    },
    offset: {
      type: Number,
      "default": 0,
      coerce: Number
    },
    after: {
      type: Number,
      "default": 0,
      coerce: Number
    },
    ignoreparent: {
      type: Boolean,
      "default": false
    },
    initial: {
      type: Boolean,
      "default": false
    }
  },
  mixins: [require("vue-mixins/onWindowScroll"), require("vue-mixins/getViewportSize"), require("vue-mixins/onWindowResize")],
  methods: {
    processScroll: function() {
      var bottom, box, top;
      box = this.target.getBoundingClientRect();
      top = box.top - this.height;
      bottom = box.bottom;
      if (this.initial && !this.lastPos) {
        this.lastPos = {
          top: Number.MAX_VALUE,
          bottom: Number.MAX_VALUE
        };
      }
      if (this.lastPos != null) {
        if (!this.state.entered && (this.lastPos.top >= -this.offset && top <= -this.offset) || (this.lastPos.bottom <= this.offset && bottom >= this.offset)) {
          if (this.after > -this.offset) {
            setTimeout(((function(_this) {
              return function() {
                return _this.$emit("entered", _this.parent);
              };
            })(this)), this.after);
          } else {
            this.$emit("entered", this.parent);
          }
          if (!this.multiple) {
            this.state.entered = true;
          }
        }
        if (!this.state.left && (this.lastPos.bottom >= -this.offset && bottom <= -this.offset) || (this.lastPos.top <= this.offset && top >= this.offset)) {
          if (this.after > 0) {
            setTimeout(((function(_this) {
              return function() {
                return _this.$emit("left", _this.parent);
              };
            })(this)), this.after);
          } else {
            this.$emit("left", this.parent);
          }
          if (!this.multiple) {
            this.state.left = true;
          }
          if (!this.multiple) {
            setTimeout(this.disposeListener, 1);
          }
        }
        if (top < 0 && bottom > 0) {
          this.$emit("progress", {
            parent: this.$parent,
            top: -top,
            bottom: bottom
          });
        }
      }
      return this.lastPos = {
        top: top,
        bottom: bottom
      };
    },
    getHeight: function() {
      return this.height = this.getViewportSize().height;
    }
  },
  compiled: function() {
    this.state = {
      entered: false,
      left: false
    };
    this.getHeight();
    this.onWindowResize(this.getHeight);
    return this.disposeListener = this.onWindowScroll(this.processScroll);
  },
  ready: function() {
    this.parent = this.$parent;
    this.target = this.ignoreparent ? this.$el : this.$el.parentElement;
    return this.processScroll();
  }
};

if (module.exports.__esModule) module.exports = module.exports.default
;(typeof module.exports === "function"? module.exports.options: module.exports).template = "<span><slot></slot></span>"
