import { TimelineMax } from "gsap";
import Player from "@vimeo/player";

import Brands from "classes/Brands";
import Newsletter from "classes/Newsletter";
import Page from "classes/Page";
import Slider from "classes/Slider";
import Testimonials from "classes/Testimonials";

import { Detection } from "classes/Detection";

export default class extends Page {
  constructor() {
    super({ selector: ".service" });
  }

  create() {
    super.create();

    this.elements = {
      brandsList: document.querySelector(".service__brands__list"),
      brandsItems: document.querySelectorAll(".service__brands__item"),
      brandsButtons: document.querySelectorAll(
        ".service__brands__item__wrapper"
      ),

      newsletter: document.querySelector(".service__aside__newsletter__form"),
      newsletterButton: document.querySelector(
        ".service__aside__newsletter__button"
      ),
      newsletterInput: document.querySelector(
        ".service__aside__newsletter__input"
      ),

      video: document.querySelector(".service__know__vimeo__iframe"),

      testimonials: document.querySelector(".service__testimonials"),
      testimonialsWrapper: document.querySelector(
        ".service__testimonials__wrapper"
      ),
      testimonialsItems: document.querySelectorAll(".service__testimonial"),
      testimonialsItemsWrappers: document.querySelectorAll(
        ".service__testimonial__wrapper"
      ),
      testimonialsMedias: document.querySelectorAll(
        ".service__testimonial__media"
      ),
      testimonialsDescriptions: document.querySelectorAll(
        ".service__testimonial__description"
      ),
      testimonialsAuthorTitles: document.querySelectorAll(
        ".service__testimonial__author__title"
      ),
      testimonialsAuthorDescriptions: document.querySelectorAll(
        ".service__testimonial__author__description"
      ),
      testimonialsAuthorImages: document.querySelectorAll(
        ".service__testimonial__author__image"
      ),
      testimonialsButtonNext: document.querySelector(
        ".service__testimonials__navigation__button--next"
      ),
      testimonialsButtonPrevious: document.querySelector(
        ".service__testimonials__navigation__button--previous"
      ),
      testimonialsPaginations: document.querySelectorAll(
        ".service__testimonials__pagination__button"
      )
    };

    this.createBrands();
    this.createPlayer();
    this.createNewsletter();
    this.createTestimonials();
  }

  createTestimonials() {
    if (Detection.isPhone) {
      this.testimonialsSlider = new Slider({
        element: this.elements.testimonialsWrapper,
        elements: {
          items: this.elements.testimonialsItems,
          buttons: this.elements.testimonialsItemsWrappers
        }
      });

      this.testimonialsSlider.enable();

      this.testimonialsSlider.on("change", index => {
        each(this.elements.testimonialsPaginations, (button, buttonIndex) => {
          if (buttonIndex === index) {
            button.classList.add(
              "how__testimonials__pagination__button--active"
            );
          } else {
            button.classList.remove(
              "how__testimonials__pagination__button--active"
            );
          }
        });
      });
    } else {
      this.testimonials = new Testimonials({
        classes: {
          paginationsActive: "how__testimonials__pagination__button--active"
        },
        element: this.elements.testimonials,
        elements: {
          items: this.elements.testimonialsItems,
          medias: this.elements.testimonialsMedias,
          descriptions: this.elements.testimonialsDescriptions,
          authorTitles: this.elements.testimonialsAuthorTitles,
          authorDescriptions: this.elements.testimonialsAuthorDescriptions,
          authorImages: this.elements.testimonialsAuthorImages,
          buttonNext: this.elements.testimonialsButtonNext,
          buttonPrevious: this.elements.testimonialsButtonPrevious,
          paginations: this.elements.testimonialsPaginations
        }
      });
    }
  }

  createBrands() {
    if (Detection.isPhone) {
      this.brandsSlider = new Slider({
        element: this.elements.brandsList,
        elements: {
          items: this.elements.brandsItems,
          buttons: this.elements.brandsButtons
        }
      });

      this.brandsSlider.enable();
    } else {
      this.brands = new Brands({
        items: this.elements.brandsItems,
        list: this.elements.brandsList
      });
    }
  }

  createPlayer() {
    if (!this.elements.video) {
      return;
    }

    this.player = new Player(this.elements.video);
  }

  createNewsletter() {
    if (!this.elements.newsletter) {
      return;
    }

    this.newsletter = new Newsletter({
      button: this.elements.newsletterButton,
      classes: {
        input: "service__aside__newsletter__input--error"
      },
      form: this.elements.newsletter,
      input: this.elements.newsletterInput
    });
  }

  show() {
    this.create();

    this.timelineIn = new TimelineMax();

    super.show(this.timelineIn);
  }

  hide() {
    this.timelineOut = new TimelineMax();

    super.hide(this.timelineOut);
  }

  onBlur() {
    if (this.player) {
      this.player.pause();
    }
  }

  onFocus() {
    if (this.player) {
      this.player.play();
    }
  }

  addEventListeners() {
    super.addEventListeners();

    this.onBlurEvent = this.onBlur.bind(this);
    this.onFocusEvent = this.onFocus.bind(this);

    window.addEventListener("blur", this.onBlurEvent);
    window.addEventListener("focus", this.onFocusEvent);
  }

  removeEventListeners() {
    super.removeEventListeners();

    window.removeEventListener("blur", this.onBlurEvent);
    window.removeEventListener("focus", this.onFocusEvent);
  }
}
