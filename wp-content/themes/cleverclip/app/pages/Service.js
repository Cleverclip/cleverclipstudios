import { TimelineMax, TweenMax, Power4 } from "gsap";
import { each } from "lodash";
import Player from "@vimeo/player";

import Brands from "classes/Brands";
import Newsletter from "classes/Newsletter";
import Page from "classes/Page";
import Slider from "classes/Slider";
import Testimonials from "classes/Testimonials";

import { Detection } from "classes/Detection";

import { split } from "utils/text";

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

      fieldsList: document.querySelector(".service__fields__list"),
      fieldsItems: document.querySelectorAll(".service__fields__item"),
      fieldsButtons: document.querySelectorAll(
        ".service__fields__item__wrapper"
      ),

      aboutList: document.querySelector(".service__about__list"),
      aboutItems: document.querySelectorAll(".service__about__item"),
      aboutButtons: document.querySelectorAll(".service__about__item__wrapper"),

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
    this.createFields();
    this.createAbout();
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
    }
  }

  createFields() {
    if (Detection.isPhone) {
      this.fieldsSlider = new Slider({
        element: this.elements.fieldsList,
        elements: {
          items: this.elements.fieldsItems,
          buttons: this.elements.fieldsButtons
        }
      });

      this.fieldsSlider.enable();
    }
  }

  createAbout() {
    if (Detection.isPhone) {
      this.aboutSlider = new Slider({
        element: this.elements.aboutList,
        elements: {
          items: this.elements.aboutItems,
          buttons: this.elements.aboutButtons
        }
      });

      this.aboutSlider.enable();
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
