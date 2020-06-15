import { TimelineMax } from 'gsap'
import { each } from 'lodash'

import Page from 'classes/Page'
import Slider from 'classes/Slider'
import Testimonials from 'classes/Testimonials'

import { Detection } from 'classes/Detection'

export default class extends Page {
  constructor () {
    super({ selector: '.clients' })
  }

  create () {
    super.create()

    this.elements = {
      testimonials: document.querySelector('.clients__testimonials'),
      testimonialsWrapper: document.querySelector('.clients__testimonials__wrapper'),
      testimonialsItems: document.querySelectorAll('.clients__testimonial'),
      testimonialsItemsWrappers: document.querySelectorAll('.clients__testimonial__wrapper'),
      testimonialsMedias: document.querySelectorAll('.clients__testimonial__media'),
      testimonialsDescriptions: document.querySelectorAll('.clients__testimonial__description'),
      testimonialsAuthorTitles: document.querySelectorAll('.clients__testimonial__author__title'),
      testimonialsAuthorDescriptions: document.querySelectorAll('.clients__testimonial__author__description'),
      testimonialsAuthorImages: document.querySelectorAll('.clients__testimonial__author__image'),
      testimonialsButtonNext: document.querySelector('.clients__testimonials__navigation__button--next'),
      testimonialsButtonPrevious: document.querySelector('.clients__testimonials__navigation__button--previous'),
      testimonialsPaginations: document.querySelectorAll('.clients__testimonials__pagination__button'),

      highlights: document.querySelector('.clients__highlights'),
      highlightsList: document.querySelector('.clients__highlights__list'),
      highlightsItems: document.querySelectorAll('.clients__highlights__item'),
      highlightsItemsWrappers: document.querySelectorAll('.clients__highlights__item__wrapper'),
      highlightsCloses: document.querySelectorAll('.clients__highlights__item__close'),
      clientLogos: document.querySelectorAll(".clients__clients__item"),
      clientsShowMoreButton: document.querySelector(".clients__clients__button")
    };

    this.visibleClientLogos = 0;

    this.createTestimonials();
    this.createHighlights();
    this.createClients();
  }

  createTestimonials () {
    if (Detection.isPhone) {
      this.testimonialsSlider = new Slider({
        element: this.elements.testimonialsWrapper,
        elements: {
          items: this.elements.testimonialsItems,
          buttons: this.elements.testimonialsItemsWrappers
        }
      })

      this.testimonialsSlider.enable()

      this.testimonialsSlider.on('change', index => {
        each(this.elements.testimonialsPaginations, (button, buttonIndex) => {
          if (buttonIndex === index) {
            button.classList.add('clients__testimonials__pagination__button--active')
          } else {
            button.classList.remove('clients__testimonials__pagination__button--active')
          }
        })
      })
    } else {
      this.testimonials = new Testimonials({
        classes: {
          paginationsActive: 'clients__testimonials__pagination__button--active'
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
      })
    }
  }

  createHighlights () {
    if (Detection.isPhone) {
      this.highlightsSlider = new Slider({
        element: this.elements.highlightsList,
        elements: {
          items: this.elements.highlightsItems,
          buttons: this.elements.highlightsItemsWrappers
        }
      })

      this.highlightsSlider.enable()
    }
  }

  createClients() {
    const visibleClientLogosNext = Math.min(this.visibleClientLogos + 25, this.elements.clientLogos.length);

    for (let i = this.visibleClientLogos; i < visibleClientLogosNext; i++) {
      this.elements.clientLogos[i].classList.add("clients__clients__item--active");
    }

    if (visibleClientLogosNext === this.elements.clientLogos.length) {
      this.elements.clientsShowMoreButton.classList.add("clients__clients__button--hide");
      return;
    }

    this.visibleClientLogos = visibleClientLogosNext;
  }

  show () {
    this.create()

    this.timelineIn = new TimelineMax()

    super.show(this.timelineIn)
  }

  hide () {
    this.timelineOut = new TimelineMax()

    super.hide(this.timelineOut)
  }

  onHighlightOpen (event) {
    const { target } = event

    event.stopPropagation()

    each(this.elements.highlightsItems, item => {
      item.classList.add('clients__highlights__item--disabled')
    })

    console.log(target)

    target.parentNode.classList.add('clients__highlights__item--active')
    target.parentNode.classList.remove('clients__highlights__item--disabled')
  }

  onHighlightClose (event) {
    event.stopPropagation()

    each(this.elements.highlightsItems, item => {
      item.classList.remove('clients__highlights__item--disabled')
    })

    event.target.parentNode.parentNode.parentNode.classList.remove('clients__highlights__item--active')
  }

  addEventListeners () {
    super.addEventListeners()

    this.onHighlightOpenEvent = this.onHighlightOpen.bind(this);
    this.onHighlightCloseEvent = this.onHighlightClose.bind(this);
    this.onShowMoreClientsEvent = this.createClients.bind(this);

    this.elements.clientsShowMoreButton.addEventListener("click", this.onShowMoreClientsEvent);

    each(this.elements.highlightsItemsWrappers, item => {
      item.addEventListener('click', this.onHighlightOpenEvent)
    })

    each(this.elements.highlightsCloses, close => {
      close.addEventListener('click', this.onHighlightCloseEvent)
    })
  }

  removeEventListeners () {
    super.removeEventListeners()

    each(this.elements.highlightsItemsWrappers, item => {
      item.removeEventListener('click', this.onHighlightOpenEvent)
    })

    each(this.elements.highlightsCloses, close => {
      close.removeEventListener('click', this.onHighlightCloseEvent)
    })
  }

  destroy () {
    if (this.testimonials) {
      this.testimonials.destroy()
    }
  }
}
