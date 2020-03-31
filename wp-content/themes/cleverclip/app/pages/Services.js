import { Power4, TimelineMax, TweenMax } from 'gsap'
import Scroll from 'scroll-to'

import Newsletter from 'classes/Newsletter'
import Page from 'classes/Page'
import Slider from 'classes/Slider'

import { Detection } from 'classes/Detection'

export default class extends Page {
  constructor () {
    super({ selector: '.services' })
  }

  create () {
    super.create()

    this.elements = {
      newsletter: document.querySelector('.services__aside__newsletter__form'),
      newsletterButton: document.querySelector('.services__aside__newsletter__button'),
      newsletterInput: document.querySelector('.services__aside__newsletter__input'),

      core: document.querySelector('.services__core'),
      coreList: document.querySelector('.services__core__list'),
      coreItems: document.querySelectorAll('.services__core__item'),
      coreItemsWrappers: document.querySelectorAll('.services__core__item__wrapper'),

      clients: document.querySelector('.services__clients'),
      clientsList: document.querySelector('.services__clients__list'),
      clientsItems: document.querySelectorAll('.services__clients__item'),
      clientsButton: document.querySelector('.services__clients__more'),

    }

    this.createNewsletter()
    this.createCore()
    this.createClients()
  }

  createNewsletter () {
    this.newsletter = new Newsletter({
      button: this.elements.newsletterButton,
      classes: {
        input: 'services__aside__newsletter__input--error',
      },
      form: this.elements.newsletter,
      input: this.elements.newsletterInput
    })
  }

  createCore () {
    if (Detection.isPhone) {
      this.coreSlider = new Slider({
        element: this.elements.coreList,
        elements: {
          items: this.elements.coreItems,
          buttons: this.elements.coreItemsWrappers
        }
      })
      this.coreSlider.enable()
    }
  }

  createClients () {
    const { clientHeight } = this.elements.clientsItems[0]

    this.clientsHeight = clientHeight * 5

    this.elements.clientsList.style.maxHeight = `${this.clientsHeight}px`
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

  onClientsMoreClick () {
    const { clientHeight } = this.elements.clientsItems[0]
    const { scrollHeight } = this.elements.clientsList

    this.clientsHeight += clientHeight * 5

    TweenMax.to(this.elements.clientsList, 1, {
      ease: Power4.easeOut,
      maxHeight: this.clientsHeight
    })

    const scroll = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop

    Scroll(0, scroll + clientHeight * 5, {
      duration: 1000,
      ease: 'in-out-expo'
    })

    if (scrollHeight <= this.clientsHeight) {
      TweenMax.to(this.elements.clientsButton, 1, {
        autoAlpha: 0
      })
    }
  }

  addEventListeners () {
    super.addEventListeners()

    this.onClientsMoreClickEvent = this.onClientsMoreClick.bind(this)

    this.elements.clientsButton.addEventListener('click', this.onClientsMoreClickEvent)
  }

  removeEventListeners () {
    super.removeEventListeners()

    this.elements.clientsButton.removeEventListener('click', this.onClientsMoreClickEvent)
  }

  destroyCore () {
    if (this.coreSlider) {
      this.coreSlider.destroy()
    }
  }

  destroy () {
    super.destroy()

    this.destroyCore()
  }
}
