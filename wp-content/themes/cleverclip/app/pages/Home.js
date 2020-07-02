import { TimelineMax, TweenMax, Power4 } from "gsap";
import { each } from "lodash";
import Lottie from "lottie-web";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

import Newsletter from "classes/Newsletter";
import Page from "classes/Page";
import Slider from "classes/Slider";
import Testimonials from "classes/Testimonials";

import { Detection } from "classes/Detection";

import { split } from "utils/text";

function getRandomInRange(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default class extends Page {
  constructor() {
    super({ selector: ".home" });
  }

  create() {
    super.create();

    this.elements = {
      header: document.querySelector(".home__header"),
      headerAnimation: document.querySelector(".home__header__animation"),
      headerTitle: document.querySelector("span.home__header__title"),
      headerLines: document.querySelectorAll(".home__header__title__line"),
      headerLinesMultiple: document.querySelectorAll(
        ".home__header__title__line--multiple"
      ),

      brandsList: document.querySelector(".home__brands__list"),
      brandsItems: document.querySelectorAll(".home__brands__item"),
      brandsButtons: document.querySelectorAll(".home__brands__item__wrapper"),

      partnersList: document.querySelector(".home__partners__list"),
      partnersItems: document.querySelectorAll(".home__partners__item"),
      partnersButtons: document.querySelectorAll(
        ".home__partners__item__wrapper"
      ),

      industriesItems: document.querySelectorAll(".home__industries__article"),
      industryIconContainerSelector: ".home__industries__article__image",

      testimonials: document.querySelector(".home__partners__testimonials"),
      testimonialsWrapper: document.querySelector(
        ".home__partners__testimonials__wrapper"
      ),
      testimonialsItems: document.querySelectorAll(
        ".home__partners__testimonial"
      ),
      testimonialsItemsWrappers: document.querySelectorAll(
        ".home__partners__testimonial__wrapper"
      ),
      testimonialsMedias: document.querySelectorAll(
        ".home__partners__testimonial__media"
      ),
      testimonialsDescriptions: document.querySelectorAll(
        ".home__partners__testimonial__description"
      ),
      testimonialsAuthorTitles: document.querySelectorAll(
        ".home__partners__testimonial__author__title"
      ),
      testimonialsAuthorDescriptions: document.querySelectorAll(
        ".home__partners__testimonial__author__description"
      ),
      testimonialsAuthorImages: document.querySelectorAll(
        ".home__partners__testimonial__author__image"
      ),
      testimonialsButtonNext: document.querySelector(
        ".home__partners__testimonials__navigation__button--next"
      ),
      testimonialsButtonPrevious: document.querySelector(
        ".home__partners__testimonials__navigation__button--previous"
      ),
      testimonialsPaginations: document.querySelectorAll(
        ".home__partners__testimonials__pagination__button"
      ),

      servicesList: document.querySelector(".home__services__list"),
      servicesItems: document.querySelectorAll(".home__services__item"),
      servicesButtons: document.querySelectorAll(
        ".home__services__item__wrapper"
      ),

      casesList: document.querySelector(".home__cases__list"),
      casesItems: document.querySelectorAll(".home__cases__item"),
      casesButtons: document.querySelectorAll(".home__cases__item__wrapper"),

      newsletter: document.querySelector(".home__videos__newsletter__form"),
      newsletterButton: document.querySelector(
        ".home__videos__newsletter__button"
      ),
      newsletterInput: document.querySelector(
        ".home__videos__newsletter__input"
      )
    };

    this.createHeader();
    this.createHeaderAnimation();
    this.createBrands();
    this.createPartners();
    this.createServices();
    this.createCases();
    this.createTestimonials();
    this.createNewsletter();
    this.initializeInlineVideos();

    //this.createIndustries();
  }

  onResize() {
    super.onResize();
    this.setHeaderLineWidths();
  }

  /**
   * Sets the widths of the animated lines in the header
   * @param doSplit - splits the content of animated lines into separate spans,
   * should only do on first render, not resize
   */
  setHeaderLineWidths(doSplit = false) {
    each(this.elements.headerLines, line => {
      const texts = line.querySelectorAll("span");

      let width = 0;

      each(texts, text => {
        const { clientWidth } = text;

        if (doSplit)
          split({
            append: false,
            element: text,
            expression: ""
          });

        if (width < clientWidth) {
          width = clientWidth;
        }
      });

      TweenMax.set(line, { width });
    });
  }

  createHeader() {
    this.elements.headerTitle.classList.add("home__header__title--active");

    this.setHeaderLineWidths(true);

    each(this.elements.headerLinesMultiple, line => {
      const text = line.querySelector(".home__header__title__text");

      TweenMax.set(text, {
        autoAlpha: 1
      });

      TweenMax.staggerFromTo(
        text.querySelectorAll("span"),
        1,
        {
          autoAlpha: 0,
          display: "inline-block",
          x: 25
        },
        {
          autoAlpha: 1,
          ease: Power4.easeOut,
          onComplete: () => {
            text.classList.add("home__header__title__text--active");
          },
          x: 0
        },
        0.05
      );
    });

    this.line = this.elements.headerLinesMultiple[0];

    setTimeout(() => {
      this.animateNextLine();
    }, 2000);
  }

  animateNextLine() {
    const text = this.line.querySelector(".home__header__title__text--active");
    const textNext = text.nextElementSibling
      ? text.nextElementSibling
      : this.line.querySelector(".home__header__title__text");

    const timeline = new TimelineMax();

    timeline.to(text, 0.5, {
      autoAlpha: 0
    });

    timeline.call(() => {
      text.classList.remove("home__header__title__text--active");
      textNext.classList.add("home__header__title__text--active");
    });

    timeline.set(textNext, {
      autoAlpha: 1
    });

    timeline.staggerFromTo(
      textNext.querySelectorAll("span"),
      1,
      {
        autoAlpha: 0,
        display: "inline-block",
        x: 25
      },
      {
        autoAlpha: 1,
        ease: Power4.easeOut,
        x: 0
      },
      0.025
    );

    timeline.call(() => {
      this.line =
        this.line === this.elements.headerLinesMultiple[0]
          ? this.elements.headerLinesMultiple[1]
          : this.elements.headerLinesMultiple[0];
    });

    timeline.call(() => {
      this.animateNextLine();
    });
  }

  createHeaderAnimation() {
    if (!Detection.isPhone) {
      this.headerAnimation = Lottie.loadAnimation({
        container: this.elements.headerAnimation,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: this.elements.headerAnimation.dataset.animation
      });
    }
  }

  createIndustries() {
    this.animatedIndustryIcons = [];
    if (!Detection.isPhone) {
      this.elements.industriesItems.forEach(item => {
        this.animatedIndustryIcons.push(Lottie.loadAnimation({
          container: item.querySelector(this.elements.industryIconContainerSelector),
          renderer: "svg",
          loop: false,
          autoplay: false,
          path: item.dataset.animation
        }))
      })
    }

    this.industryAnimationInterval = setInterval(() => {
      const toAnimate = this.animatedIndustryIcons[Math.floor(getRandomInRange(0, this.animatedIndustryIcons.length-1))];
      toAnimate.goToAndPlay(0);
    }, 2000)
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

  createPartners() {
    if (Detection.isPhone) {
      this.partnersSlider = new Slider({
        element: this.elements.partnersList,
        elements: {
          items: this.elements.partnersItems,
          buttons: this.elements.partnersButtons
        }
      });

      this.partnersSlider.enable();
    }
  }

  createServices() {
    if (Detection.isPhone) {
      this.servicesSlider = new Slider({
        element: this.elements.servicesList,
        elements: {
          items: this.elements.servicesItems,
          buttons: this.elements.servicesButtons
        }
      });

      this.servicesSlider.enable();
    }
  }

  createCases() {
    if (Detection.isPhone) {
      this.casesSlider = new Slider({
        element: this.elements.casesList,
        elements: {
          items: this.elements.casesItems,
          buttons: this.elements.casesButtons
        }
      });

      this.casesSlider.enable();
    }
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
              "home__partners__testimonials__pagination__button--active"
            );
          } else {
            button.classList.remove(
              "home__partners__testimonials__pagination__button--active"
            );
          }
        });
      });
    } else {
      this.testimonials = new Testimonials({
        classes: {
          paginationsActive:
            "home__partners__testimonials__pagination__button--active"
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

  createNewsletter() {
    if (!this.elements.newsletter) {
      return;
    }

    this.newsletter = new Newsletter({
      button: this.elements.newsletterButton,
      classes: {
        input: "home__videos__newsletter__input--error"
      },
      form: this.elements.newsletter,
      input: this.elements.newsletterInput
    });
  }

  initializeInlineVideos() {
    const players = Plyr.setup(".js-player");
    players.forEach((player, index) => {
      if (index == 0) {
        player.on("play", event => {
          const instance = event.detail.plyr;
          instance.currentTime < 1 && player.fullscreen.enter();
        });
      }
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

  destroy() {
    if (this.testimonials) {
      this.testimonials.destroy();
    }

    if (this.industryAnimationInterval) {
      clearInterval(this.industryAnimationInterval);
      this.animatedIndustryIcons = [];
    }
  }
}
