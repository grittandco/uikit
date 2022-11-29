import Cookies from "js-cookie";
import Modal from "../mixin/modal";
import { addClass, css, hasClass, height, removeClass } from "uikit-util";

export default {
  mixins: [Modal],

  args: "type",

  props: {
    type: String,
    delay: Number,
    expires: Number,
    cookie: Boolean,
  },

  data: {
    clsPage: "uk-modal-page",
    selPanel: ".uk-modal-dialog",
    selClose:
      ".uk-modal-close, .uk-modal-close-default, .uk-modal-close-outside, .uk-modal-close-full",
    type: "exit",
    delay: 0,
    expires: 7,
    cookie: true,
  },

  computed: {
    cookie: {
      get() {
        return Cookies.get(this.$el.id) || true;
      },

      set(value) {
        Cookies.set(this.$el.id, value, { expires: this.expires });
      },
    },
    param() {
      return getParam("popup") == this.$el.id;
    },
  },

  events: [
    {
      name: "show",

      self: true,

      handler() {
        if (hasClass(this.panel, "uk-margin-auto-vertical")) {
          addClass(this.$el, "uk-flex");
        } else {
          css(this.$el, "display", "block");
        }

        height(this.$el); // force reflow
      },
    },

    {
      name: "hidden",

      self: true,

      handler() {
        css(this.$el, "display", "");
        removeClass(this.$el, "uk-flex");

        if (this.expires !== 0) {
          this.cookie = false;
        }
      },
    },

    {
      name: "mouseout",

      el: document,

      filter() {
        return (
          this.type === "exit" && (this.expires === 0 || this.cookie == true)
        );
      },

      handler(event) {
        if (this.cookie != true) {
          return;
        }

        if (
          event.clientY < 50 &&
          event.relatedTarget == null &&
          event.target.nodeName.toLowerCase() !== "select"
        ) {
          let show = this.show;
          setTimeout(show, this.delay);
        }
      },
    },
  ],

  connected() {
    // add modal class
    !hasClass(this.$el, "uk-modal") && addClass(this.$el, "uk-modal");

    // trigger entry popup
    if (this.type === "entry" && (this.expires === 0 || this.cookie == true)) {
      let show = this.show;
      setTimeout(show, this.delay);
    }
    if (
      this.type === "query-string" &&
      this.param &&
      (this.expires === 0 || this.cookie == true)
    ) {
      let show = this.show;
      setTimeout(show, this.delay);
    }
  },
};

function getParam(name) {
  const match = new RegExp(`[?&]${name}=([^&]*)`).exec(window.location.search);
  return match && decodeURIComponent(match[1].replace(/\+/g, " "));
}