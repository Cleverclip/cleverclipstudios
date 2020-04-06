import { TimelineMax } from 'gsap'
import { each } from 'lodash'
import Scroll from 'scroll-to'

import Contact from 'classes/Contact'
import Page from 'classes/Page'
import Slider from 'classes/Slider'

import { Detection } from 'classes/Detection'

import { getOffset } from 'utils/dom'

export default class extends Page {
  constructor () {
    super({ selector: '.about' })
  }

  create () {
    super.create()

    this.elements = {
      teamItems: document.querySelectorAll('.about__team__item'),
      teamItemsArticleOverlay: document.querySelectorAll('.about__team__article__wrapper'),
      teamItemsCloses: document.querySelectorAll('.about__team__article__close'),

      know: document.querySelector('.about__know'),
      knowList: document.querySelector('.about__know__list'),
      knowItems: document.querySelectorAll('.about__know__item'),
      knowItemsWrappers: document.querySelectorAll('.about__know__item__wrapper'),

      contact: document.querySelector('.about__contact__form'),
      contactButton: document.querySelector('.about__contact__form__button')
    }

    this.createContact()
    this.createKnow()
  }

  createContact () {
    this.contact = new Contact({
      button: this.elements.contactButton,
      classes: {
        error: 'about__contact__form--error'
      },
      form: this.elements.contact,
    })
  }

  createKnow () {
    if (Detection.isPhone) {
      this.knowSlider = new Slider({
        element: this.elements.knowList,
        elements: {
          items: this.elements.knowItems,
          buttons: this.elements.knowItemsWrappers
        }
      })

      this.knowSlider.enable()
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

  onItemOpen ({ target }) {
    document.body.style.overflow = "hidden"

    each(this.elements.teamItems, item => {
      item.classList.remove('about__team__item--active')
    })

    const { top } = getOffset(target)

    Scroll(0, top - 200, {
      duration: 1000,
      ease: 'in-out-expo'
    })

    if (!target.classList.contains('about__team__item--active')) {
      target.classList.add('about__team__item--active')
    }
  }

  onItemClose (event) {
    event.preventDefault()
    event.stopPropagation()

    document.body.style.removeProperty("overflow")
    const element = event.target.parentNode.parentNode.parentNode
    
    if (element.classList.contains('about__team__item--active')) {
      element.classList.remove('about__team__item--active')
    }
  }

  onItemOverlayCloseEvent (event) {
    event.preventDefault()
    event.stopPropagation()

    if(event.target != this) return

    document.body.style.removeProperty("overflow")
    const element = event.target.parentNode
    
    if (element.classList.contains('about__team__item--active')) {
      element.classList.remove('about__team__item--active')
    }
  }

  

  addEventListeners () {
    super.addEventListeners()

    this.onItemOpenEvent = this.onItemOpen.bind(this)
    this.onItemCloseEvent = this.onItemClose.bind(this)

    each(this.elements.teamItems, item => {
      item.addEventListener('click', this.onItemOpenEvent)
    })
    each(this.elements.teamItemsArticleOverlay, item => {
      item.addEventListener('click', this.onItemOverlayCloseEvent)
    })

    each(this.elements.teamItemsCloses, item =>  {
      item.addEventListener('click', this.onItemCloseEvent)
    })
  }

  removeEventListeners () {
    super.removeEventListeners()

    each(this.elements.teamItems, item => {
      item.removeEventListener('click', this.onItemOpenEvent)
    })

    each(this.elements.teamItemsCloses, item =>  {
      item.removeEventListener('click', this.onItemCloseEvent)
    })
  }

  destroyKnow () {
    if (this.knowSlider) {
      this.knowSlider.destroy()
    }
  }

  destroy () {
    super.destroy()

    this.destroyKnow()
  }
}
