/*! UIkit 3.15.14 | https://www.getuikit.com | (c) 2014 - 2022 YOOtheme | MIT License */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('js-cookie'), require('uikit-util')) :
    typeof define === 'function' && define.amd ? define('uikitpopup', ['js-cookie', 'uikit-util'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.UIkitPopup = factory(global.Cookies, global.UIkit.util));
})(this, (function (Cookies, uikitUtil) { 'use strict';

    var Class = {
      connected() {
        uikitUtil.addClass(this.$el, this.$options.id);
      }
    };

    var Container = {
      props: {
        container: Boolean
      },

      data: {
        container: true
      },

      computed: {
        container(_ref) {let { container } = _ref;
          return container === true && this.$container || container && uikitUtil.$(container);
        }
      }
    };

    var Togglable = {
      props: {
        cls: Boolean,
        animation: 'list',
        duration: Number,
        velocity: Number,
        origin: String,
        transition: String
      },

      data: {
        cls: false,
        animation: [false],
        duration: 200,
        velocity: 0.2,
        origin: false,
        transition: 'ease',
        clsEnter: 'uk-togglabe-enter',
        clsLeave: 'uk-togglabe-leave'
      },

      computed: {
        hasAnimation(_ref) {let { animation } = _ref;
          return !!animation[0];
        },

        hasTransition(_ref2) {let { animation } = _ref2;
          return ['slide', 'reveal'].some((transition) => uikitUtil.startsWith(animation[0], transition));
        }
      },

      methods: {
        toggleElement(targets, toggle, animate) {
          return new Promise((resolve) =>
          Promise.all(
          uikitUtil.toNodes(targets).map((el) => {
            const show = uikitUtil.isBoolean(toggle) ? toggle : !this.isToggled(el);

            if (!uikitUtil.trigger(el, "before" + (show ? 'show' : 'hide'), [this])) {
              return Promise.reject();
            }

            const promise = (
            uikitUtil.isFunction(animate) ?
            animate :
            animate === false || !this.hasAnimation ?
            toggleInstant :
            this.hasTransition ?
            toggleTransition :
            toggleAnimation)(
            el, show, this);

            const cls = show ? this.clsEnter : this.clsLeave;

            uikitUtil.addClass(el, cls);

            uikitUtil.trigger(el, show ? 'show' : 'hide', [this]);

            const done = () => {
              uikitUtil.removeClass(el, cls);
              uikitUtil.trigger(el, show ? 'shown' : 'hidden', [this]);
            };

            return promise ?
            promise.then(done, () => {
              uikitUtil.removeClass(el, cls);
              return Promise.reject();
            }) :
            done();
          })).
          then(resolve, uikitUtil.noop));

        },

        isToggled(el) {if (el === void 0) {el = this.$el;}
          [el] = uikitUtil.toNodes(el);
          return uikitUtil.hasClass(el, this.clsEnter) ?
          true :
          uikitUtil.hasClass(el, this.clsLeave) ?
          false :
          this.cls ?
          uikitUtil.hasClass(el, this.cls.split(' ')[0]) :
          uikitUtil.isVisible(el);
        },

        _toggle(el, toggled) {
          if (!el) {
            return;
          }

          toggled = Boolean(toggled);

          let changed;
          if (this.cls) {
            changed = uikitUtil.includes(this.cls, ' ') || toggled !== uikitUtil.hasClass(el, this.cls);
            changed && uikitUtil.toggleClass(el, this.cls, uikitUtil.includes(this.cls, ' ') ? undefined : toggled);
          } else {
            changed = toggled === el.hidden;
            changed && (el.hidden = !toggled);
          }

          uikitUtil.$$('[autofocus]', el).some((el) => uikitUtil.isVisible(el) ? el.focus() || true : el.blur());

          if (changed) {
            uikitUtil.trigger(el, 'toggled', [toggled, this]);
          }
        }
      }
    };

    function toggleInstant(el, show, _ref3) {let { _toggle } = _ref3;
      uikitUtil.Animation.cancel(el);
      uikitUtil.Transition.cancel(el);
      return _toggle(el, show);
    }

    async function toggleTransition(
    el,
    show, _ref4)

    {var _animation$;let { animation, duration, velocity, transition, _toggle } = _ref4;
      const [mode = 'reveal', startProp = 'top'] = ((_animation$ = animation[0]) == null ? void 0 : _animation$.split('-')) || [];

      const dirs = [
      ['left', 'right'],
      ['top', 'bottom']];

      const dir = dirs[uikitUtil.includes(dirs[0], startProp) ? 0 : 1];
      const end = dir[1] === startProp;
      const props = ['width', 'height'];
      const dimProp = props[dirs.indexOf(dir)];
      const marginProp = "margin-" + dir[0];
      const marginStartProp = "margin-" + startProp;

      let currentDim = uikitUtil.dimensions(el)[dimProp];

      const inProgress = uikitUtil.Transition.inProgress(el);
      await uikitUtil.Transition.cancel(el);

      if (show) {
        _toggle(el, true);
      }

      const prevProps = Object.fromEntries(
      [
      'padding',
      'border',
      'width',
      'height',
      'minWidth',
      'minHeight',
      'overflowY',
      'overflowX',
      marginProp,
      marginStartProp].
      map((key) => [key, el.style[key]]));


      const dim = uikitUtil.dimensions(el);
      const currentMargin = uikitUtil.toFloat(uikitUtil.css(el, marginProp));
      const marginStart = uikitUtil.toFloat(uikitUtil.css(el, marginStartProp));
      const endDim = dim[dimProp] + marginStart;

      if (!inProgress && !show) {
        currentDim += marginStart;
      }

      const [wrapper] = uikitUtil.wrapInner(el, '<div>');
      uikitUtil.css(wrapper, {
        boxSizing: 'border-box',
        height: dim.height,
        width: dim.width,
        ...uikitUtil.css(el, [
        'overflow',
        'padding',
        'borderTop',
        'borderRight',
        'borderBottom',
        'borderLeft',
        'borderImage',
        marginStartProp])

      });

      uikitUtil.css(el, {
        padding: 0,
        border: 0,
        minWidth: 0,
        minHeight: 0,
        [marginStartProp]: 0,
        width: dim.width,
        height: dim.height,
        overflow: 'hidden',
        [dimProp]: currentDim
      });

      const percent = currentDim / endDim;
      duration = (velocity * endDim + duration) * (show ? 1 - percent : percent);
      const endProps = { [dimProp]: show ? endDim : 0 };

      if (end) {
        uikitUtil.css(el, marginProp, endDim - currentDim + currentMargin);
        endProps[marginProp] = show ? currentMargin : endDim + currentMargin;
      }

      if (!end ^ mode === 'reveal') {
        uikitUtil.css(wrapper, marginProp, -endDim + currentDim);
        uikitUtil.Transition.start(wrapper, { [marginProp]: show ? 0 : -endDim }, duration, transition);
      }

      try {
        await uikitUtil.Transition.start(el, endProps, duration, transition);
      } finally {
        uikitUtil.css(el, prevProps);
        uikitUtil.unwrap(wrapper.firstChild);

        if (!show) {
          _toggle(el, false);
        }
      }
    }

    function toggleAnimation(el, show, cmp) {
      uikitUtil.Animation.cancel(el);

      const { animation, duration, _toggle } = cmp;

      if (show) {
        _toggle(el, true);
        return uikitUtil.Animation.in(el, animation[0], duration, cmp.origin);
      }

      return uikitUtil.Animation.out(el, animation[1] || animation[0], duration, cmp.origin).then(() =>
      _toggle(el, false));

    }

    const active = [];

    var Modal = {
      mixins: [Class, Container, Togglable],

      props: {
        selPanel: String,
        selClose: String,
        escClose: Boolean,
        bgClose: Boolean,
        stack: Boolean
      },

      data: {
        cls: 'uk-open',
        escClose: true,
        bgClose: true,
        overlay: true,
        stack: false
      },

      computed: {
        panel(_ref, $el) {let { selPanel } = _ref;
          return uikitUtil.$(selPanel, $el);
        },

        transitionElement() {
          return this.panel;
        },

        bgClose(_ref2) {let { bgClose } = _ref2;
          return bgClose && this.panel;
        }
      },

      beforeDisconnect() {
        if (uikitUtil.includes(active, this)) {
          this.toggleElement(this.$el, false, false);
        }
      },

      events: [
      {
        name: 'click',

        delegate() {
          return this.selClose;
        },

        handler(e) {
          e.preventDefault();
          this.hide();
        }
      },

      {
        name: 'click',

        delegate() {
          return 'a[href*="#"]';
        },

        handler(_ref3) {let { current, defaultPrevented } = _ref3;
          const { hash } = current;
          if (
          !defaultPrevented &&
          hash &&
          isSameSiteAnchor(current) &&
          !uikitUtil.within(hash, this.$el) &&
          uikitUtil.$(hash, document.body))
          {
            this.hide();
          }
        }
      },

      {
        name: 'toggle',

        self: true,

        handler(e) {
          if (e.defaultPrevented) {
            return;
          }

          e.preventDefault();

          if (this.isToggled() === uikitUtil.includes(active, this)) {
            this.toggle();
          }
        }
      },

      {
        name: 'beforeshow',

        self: true,

        handler(e) {
          if (uikitUtil.includes(active, this)) {
            return false;
          }

          if (!this.stack && active.length) {
            Promise.all(active.map((modal) => modal.hide())).then(this.show);
            e.preventDefault();
          } else {
            active.push(this);
          }
        }
      },

      {
        name: 'show',

        self: true,

        handler() {
          uikitUtil.once(
          this.$el,
          'hide',
          uikitUtil.on(document, 'focusin', (e) => {
            if (uikitUtil.last(active) === this && !uikitUtil.within(e.target, this.$el)) {
              this.$el.focus();
            }
          }));


          if (this.overlay) {
            uikitUtil.once(this.$el, 'hidden', preventOverscroll(this.$el), { self: true });
            uikitUtil.once(this.$el, 'hidden', preventBackgroundScroll(), { self: true });
          }

          if (this.stack) {
            uikitUtil.css(this.$el, 'zIndex', uikitUtil.toFloat(uikitUtil.css(this.$el, 'zIndex')) + active.length);
          }

          uikitUtil.addClass(document.documentElement, this.clsPage);

          if (this.bgClose) {
            uikitUtil.once(
            this.$el,
            'hide',
            uikitUtil.on(document, uikitUtil.pointerDown, (_ref4) => {let { target } = _ref4;
              if (
              uikitUtil.last(active) !== this ||
              this.overlay && !uikitUtil.within(target, this.$el) ||
              uikitUtil.within(target, this.panel))
              {
                return;
              }

              uikitUtil.once(
              document,
              uikitUtil.pointerUp + " " + uikitUtil.pointerCancel + " scroll",
              (_ref5) => {let { defaultPrevented, type, target: newTarget } = _ref5;
                if (
                !defaultPrevented &&
                type === uikitUtil.pointerUp &&
                target === newTarget)
                {
                  this.hide();
                }
              },
              true);

            }),
            { self: true });

          }

          if (this.escClose) {
            uikitUtil.once(
            this.$el,
            'hide',
            uikitUtil.on(document, 'keydown', (e) => {
              if (e.keyCode === 27 && uikitUtil.last(active) === this) {
                this.hide();
              }
            }),
            { self: true });

          }
        }
      },

      {
        name: 'shown',

        self: true,

        handler() {
          if (!uikitUtil.isFocusable(this.$el)) {
            uikitUtil.attr(this.$el, 'tabindex', '-1');
          }

          if (!uikitUtil.$(':focus', this.$el)) {
            this.$el.focus();
          }
        }
      },

      {
        name: 'hidden',

        self: true,

        handler() {
          if (uikitUtil.includes(active, this)) {
            active.splice(active.indexOf(this), 1);
          }

          uikitUtil.css(this.$el, 'zIndex', '');

          if (!active.some((modal) => modal.clsPage === this.clsPage)) {
            uikitUtil.removeClass(document.documentElement, this.clsPage);
          }
        }
      }],


      methods: {
        toggle() {
          return this.isToggled() ? this.hide() : this.show();
        },

        show() {
          if (this.container && uikitUtil.parent(this.$el) !== this.container) {
            uikitUtil.append(this.container, this.$el);
            return new Promise((resolve) =>
            requestAnimationFrame(() => this.show().then(resolve)));

          }

          return this.toggleElement(this.$el, true, animate);
        },

        hide() {
          return this.toggleElement(this.$el, false, animate);
        }
      }
    };

    function animate(el, show, _ref6) {let { transitionElement, _toggle } = _ref6;
      return new Promise((resolve, reject) =>
      uikitUtil.once(el, 'show hide', () => {
        el._reject == null ? void 0 : el._reject();
        el._reject = reject;

        _toggle(el, show);

        const off = uikitUtil.once(
        transitionElement,
        'transitionstart',
        () => {
          uikitUtil.once(transitionElement, 'transitionend transitioncancel', resolve, {
            self: true
          });
          clearTimeout(timer);
        },
        { self: true });


        const timer = setTimeout(() => {
          off();
          resolve();
        }, toMs(uikitUtil.css(transitionElement, 'transitionDuration')));
      })).
      then(() => delete el._reject);
    }

    function toMs(time) {
      return time ? uikitUtil.endsWith(time, 'ms') ? uikitUtil.toFloat(time) : uikitUtil.toFloat(time) * 1000 : 0;
    }

    function preventOverscroll(el) {
      if (CSS.supports('overscroll-behavior', 'contain')) {
        const elements = filterChildren(el, (child) => /auto|scroll/.test(uikitUtil.css(child, 'overflow')));
        uikitUtil.css(elements, 'overscrollBehavior', 'contain');
        return () => uikitUtil.css(elements, 'overscrollBehavior', '');
      }

      let startClientY;

      const events = [
      uikitUtil.on(
      el,
      'touchstart',
      (_ref7) => {let { targetTouches } = _ref7;
        if (targetTouches.length === 1) {
          startClientY = targetTouches[0].clientY;
        }
      },
      { passive: true }),


      uikitUtil.on(
      el,
      'touchmove',
      (e) => {
        if (e.targetTouches.length !== 1) {
          return;
        }

        let [scrollParent] = uikitUtil.scrollParents(e.target, /auto|scroll/);
        if (!uikitUtil.within(scrollParent, el)) {
          scrollParent = el;
        }

        const clientY = e.targetTouches[0].clientY - startClientY;
        const { scrollTop, scrollHeight, clientHeight } = scrollParent;

        if (
        clientHeight >= scrollHeight ||
        scrollTop === 0 && clientY > 0 ||
        scrollHeight - scrollTop <= clientHeight && clientY < 0)
        {
          e.cancelable && e.preventDefault();
        }
      },
      { passive: false })];



      return () => events.forEach((fn) => fn());
    }

    let prevented;
    function preventBackgroundScroll() {
      if (prevented) {
        return uikitUtil.noop;
      }
      prevented = true;

      const { scrollingElement } = document;
      uikitUtil.css(scrollingElement, {
        overflowY: 'hidden',
        touchAction: 'none',
        paddingRight: uikitUtil.width(window) - scrollingElement.clientWidth
      });
      return () => {
        prevented = false;
        uikitUtil.css(scrollingElement, { overflowY: '', touchAction: '', paddingRight: '' });
      };
    }

    function filterChildren(el, fn) {
      const children = [];
      uikitUtil.apply(el, (node) => {
        if (fn(node)) {
          children.push(node);
        }
      });
      return children;
    }

    function isSameSiteAnchor(a) {
      return ['origin', 'pathname', 'search'].every((part) => a[part] === location[part]);
    }

    var Component = {
      mixins: [Modal],

      args: "type",

      props: {
        type: String,
        delay: Number,
        expires: Number,
        cookie: Boolean
      },

      data: {
        clsPage: "uk-modal-page",
        selPanel: ".uk-modal-dialog",
        selClose:
        ".uk-modal-close, .uk-modal-close-default, .uk-modal-close-outside, .uk-modal-close-full",
        type: "exit",
        delay: 0,
        expires: 7,
        cookie: true
      },

      computed: {
        cookie: {
          get() {
            return Cookies.get(this.$el.id) || true;
          },

          set(value) {
            Cookies.set(this.$el.id, value, { expires: this.expires });
          }
        },
        param() {
          return getParam("popup") == this.$el.id;
        }
      },

      events: [
      {
        name: "show",

        self: true,

        handler() {
          if (uikitUtil.hasClass(this.panel, "uk-margin-auto-vertical")) {
            uikitUtil.addClass(this.$el, "uk-flex");
          } else {
            uikitUtil.css(this.$el, "display", "block");
          }

          uikitUtil.height(this.$el); // force reflow
        }
      },

      {
        name: "hidden",

        self: true,

        handler() {
          uikitUtil.css(this.$el, "display", "");
          uikitUtil.removeClass(this.$el, "uk-flex");

          if (this.expires !== 0) {
            this.cookie = false;
          }
        }
      },

      {
        name: "mouseout",

        el: document,

        filter() {
          return (
            this.type === "exit" && (this.expires === 0 || this.cookie == true));

        },

        handler(event) {
          if (this.cookie != true) {
            return;
          }

          if (
          event.clientY < 50 &&
          event.relatedTarget == null &&
          event.target.nodeName.toLowerCase() !== "select")
          {
            let show = this.show;
            setTimeout(show, this.delay);
          }
        }
      }],


      connected() {
        // add modal class
        !uikitUtil.hasClass(this.$el, "uk-modal") && uikitUtil.addClass(this.$el, "uk-modal");

        // trigger entry popup
        if (this.type === "entry" && (this.expires === 0 || this.cookie == true)) {
          let show = this.show;
          setTimeout(show, this.delay);
        }
        if (
        this.type === "query-string" &&
        this.param && (
        this.expires === 0 || this.cookie == true))
        {
          let show = this.show;
          setTimeout(show, this.delay);
        }
      }
    };

    function getParam(name) {
      const match = new RegExp("[?&]" + name + "=([^&]*)").exec(window.location.search);
      return match && decodeURIComponent(match[1].replace(/\+/g, " "));
    }

    if (typeof window !== 'undefined' && window.UIkit) {
      window.UIkit.component('popup', Component);
    }

    return Component;

}));
