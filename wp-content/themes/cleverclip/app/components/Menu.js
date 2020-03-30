import EventEmitter from "events";
import { TweenMax } from "gsap";
import { each } from "lodash";

export default class extends EventEmitter {
  constructor() {
    super();

    this.element = document.querySelector(".menu");

    this.elements = {
      desktop: {
        items: document.querySelectorAll(".menu__item"),
        links: document.querySelectorAll(".menu__link"),
        linksDropdowns: document.querySelectorAll(".menu__link__dropdown"),
        form_button: document.getElementById("menu__form__button"),
        form_overlay: document.getElementById("menu__form__overlay"),
        form_container: document.getElementById("menu__form__container"),
        form_close: document.getElementById("menu__form__close")
      },

      mobile: {
        root: document.querySelector(".menu__mobile"),

        open: document.querySelector(".menu__toggle"),
        close: document.querySelector(".menu__mobile__header__button--close"),
        back: document.querySelector(".menu__mobile__header__button--back"),

        links: document.querySelectorAll(".menu__mobile__link"),
        linksDropdowns: document.querySelectorAll(
          ".menu__mobile__link__dropdown"
        ),

        content: document.querySelector(".menu__mobile__content"),
        lists: document.querySelectorAll(".menu__mobile__list__secondary"),

        locales: document.querySelector(".menu__mobile__select--locales"),
        form_button: document.getElementById("menu__mobile__form__button")
      }
    };

    this.addEventListeners();
  }

  close() {
    each(this.elements.desktop.items, item => {
      item.classList.remove("menu__item--active");
    });

    TweenMax.to(this.elements.mobile.root, 1, {
      ease: Power4.easeInOut,
      x: "100%"
    });

    TweenMax.to(this.elements.mobile.content, 1, {
      ease: Power4.easeInOut,
      onComplete: () => {
        each(this.elements.mobile.lists, list => {
          list.classList.remove("menu__mobile__list__secondary--active");
        });
      },
      x: "0%"
    });
  }

  onDesktopDropdownClick({ target }) {
    const { parentNode } = target;
    if (parentNode.classList.contains("menu__item--active")) {
      parentNode.classList.remove("menu__item--active");
    } else {
      each(this.elements.desktop.items, item => {
        item.classList.remove("menu__item--active");
      });

      parentNode.classList.add("menu__item--active");
    }
  }

  onMobileOpen() {
    TweenMax.to(this.elements.mobile.root, 1, {
      ease: Power4.easeInOut,
      x: "0%"
    });
  }

  onMobileClose(isForced = false) {
    if (!isForced) {
      this.onMobileListClose();
    }

    TweenMax.to(this.elements.mobile.root, 1, {
      ease: Power4.easeInOut,
      x: "100%"
    });
  }

  onMobileListOpen({ target }) {
    const { index } = target.dataset;
    
    const offset = ((parseInt(index) + 1) * -100)+"%"
    
    console.log(offset)
    TweenMax.to(this.elements.mobile.content, 1, {
      ease: Power4.easeInOut,
      x: offset
    });

    each(this.elements.mobile.lists, list => {
      const listIndex = parseInt(list.dataset.index, 10);
      if (parseInt(index, 10) === listIndex) {
        list.classList.add("menu__mobile__list__secondary--active");
      } else {
        list.classList.remove("menu__mobile__list__secondary--active");
      }
    });
  }

  onMobileListClose() {
    const list = document.querySelector(
      ".menu__mobile__list__secondary--active"
    );

    if (!list) {
      return this.onMobileClose(true);
    }

    TweenMax.to(this.elements.mobile.content, 1, {
      ease: Power4.easeInOut,
      onComplete: () => {
        each(this.elements.mobile.lists, list => {
          list.classList.remove("menu__mobile__list__secondary--active");
        });
      },
      x: "0%"
    });
  }

  onMobileLocalesToggle({ target }) {
    const { value } = target;

    if (value) {
      window.location.href = value;
    }
  }

  addEventListeners() {
    this.onDesktopDropdownClickEvent = this.onDesktopDropdownClick.bind(this);

    each(this.elements.desktop.linksDropdowns, button => {
      button.addEventListener("click", this.onDesktopDropdownClickEvent);
    });

    if (this.elements.desktop.form_container) {
      this.elements.desktop.form_container.addEventListener("click", e => {
        e.stopPropagation();
      });
    }

    if (this.elements.desktop.form_button) {
      this.elements.desktop.form_button.addEventListener("click", () => {
        this.elements.desktop.form_overlay.classList.add("active");
      });
    }

    if (this.elements.mobile.form_button) {
      this.elements.mobile.form_button.addEventListener("click", () => {
        this.elements.desktop.form_overlay.classList.add("active");
      });
    }

    if (this.elements.desktop.form_close) {
      this.elements.desktop.form_close.addEventListener("click", () => {
        this.elements.desktop.form_overlay.classList.remove("active");
      });
    }

    if (this.elements.desktop.form_overlay) {
      this.elements.desktop.form_overlay.addEventListener("click", () => {
        this.elements.desktop.form_overlay.classList.remove("active");
      });
    }

    this.onMobileOpenEvent = this.onMobileOpen.bind(this);
    this.onMobileCloseEvent = this.onMobileClose.bind(this);

    this.elements.mobile.open.addEventListener("click", this.onMobileOpenEvent);
    this.elements.mobile.close.addEventListener(
      "click",
      this.onMobileCloseEvent
    );

    this.onMobileListOpenEvent = this.onMobileListOpen.bind(this);
    this.onMobileListCloseEvent = this.onMobileListClose.bind(this);

    each(this.elements.mobile.linksDropdowns, link => {
      link.addEventListener("click", this.onMobileListOpenEvent);
    });

    this.elements.mobile.back.addEventListener(
      "click",
      this.onMobileListCloseEvent
    );

    this.onMobileLocalesToggleEvent = this.onMobileLocalesToggle.bind(this);

    this.elements.mobile.locales.addEventListener(
      "change",
      this.onMobileLocalesToggleEvent
    );
  }
}
