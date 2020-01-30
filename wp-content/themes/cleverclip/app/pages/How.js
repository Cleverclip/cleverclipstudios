import { TimelineMax } from 'gsap'
import { each } from 'lodash'

import Page from 'classes/Page'
import Slider from 'classes/Slider'
import Testimonials from 'classes/Testimonials'

import { Detection } from 'classes/Detection'

export default class extends Page {
  constructor () {
    super({ selector: '.how' })
  }

  create () {
    super.create()

    this.elements = {
      highlights: document.querySelector('.how__highlights'),
      highlightsList: document.querySelector('.how__highlights__list'),
      highlightsItems: document.querySelectorAll('.how__highlights__item'),
      highlightsItemsWrappers: document.querySelectorAll('.how__highlights__item__wrapper'),
      highlightsPaginations: document.querySelectorAll('.how__highlights__pagination__button'),

      testimonials: document.querySelector('.how__testimonials'),
      testimonialsWrapper: document.querySelector('.how__testimonials__wrapper'),
      testimonialsItems: document.querySelectorAll('.how__testimonial'),
      testimonialsItemsWrappers: document.querySelectorAll('.how__testimonial__wrapper'),
      testimonialsMedias: document.querySelectorAll('.how__testimonial__media'),
      testimonialsDescriptions: document.querySelectorAll('.how__testimonial__description'),
      testimonialsAuthorTitles: document.querySelectorAll('.how__testimonial__author__title'),
      testimonialsAuthorDescriptions: document.querySelectorAll('.how__testimonial__author__description'),
      testimonialsAuthorImages: document.querySelectorAll('.how__testimonial__author__image'),
      testimonialsButtonNext: document.querySelector('.how__testimonials__navigation__button--next'),
      testimonialsButtonPrevious: document.querySelector('.how__testimonials__navigation__button--previous'),
      testimonialsPaginations: document.querySelectorAll('.how__testimonials__pagination__button')
    }

    this.createHighlights()
    this.createTestimonials()
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

      this.highlightsSlider.on('change', index => {
        each(this.elements.highlightsPaginations, (button, buttonIndex) => {
          if (buttonIndex === index) {
            button.classList.add('how__highlights__pagination__button--active')
          } else {
            button.classList.remove('how__highlights__pagination__button--active')
          }
        })
      })
    }
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
            button.classList.add('how__testimonials__pagination__button--active')
          } else {
            button.classList.remove('how__testimonials__pagination__button--active')
          }
        })
      })
    } else {
      this.testimonials = new Testimonials({
        classes: {
          paginationsActive: 'how__testimonials__pagination__button--active'
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

  show () {
    this.create()

    this.timelineIn = new TimelineMax()

    super.show(this.timelineIn)
  }

  hide () {
    this.timelineOut = new TimelineMax()

    super.hide(this.timelineOut)
  }
}
