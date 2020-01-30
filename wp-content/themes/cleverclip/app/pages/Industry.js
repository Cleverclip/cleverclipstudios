import { TimelineMax } from 'gsap'
import Scroll from 'scroll-to'

import Brands from 'classes/Brands'
import Page from 'classes/Page'
import Slider from 'classes/Slider'

import { Detection } from 'classes/Detection'

import { getOffset } from 'utils/dom'

export default class extends Page {
  constructor () {
    super({ selector: '.industry' })
  }

  create () {
    super.create()

    this.elements = {
      header: document.querySelector('.industry__header'),
      headerButton: document.querySelector('.industry__header__button'),

      about: document.querySelector('.industry__about'),

      brandsList: document.querySelector('.industry__brands__list'),
      brandsItems: document.querySelectorAll('.industry__brands__item'),
      brandsButtons: document.querySelectorAll('.industry__brands__item__wrapper'),
    }

    this.createBrands()
  }

  createBrands () {
    if (Detection.isPhone) {
      this.brandsSlider = new Slider({
        element: this.elements.brandsList,
        elements: {
          items: this.elements.brandsItems,
          buttons: this.elements.brandsButtons
        }
      })

      this.brandsSlider.enable()
    } else {
      this.brands = new Brands({
        items: this.elements.brandsItems,
        list: this.elements.brandsList
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

  onHeaderButtonClick () {
    const menu = document.querySelector('.menu')
    const menuHeight = menu.clientHeight

    const { top } = getOffset(this.elements.about)

    Scroll(0, top - menuHeight, {
      duration: 1000,
      ease: 'in-out-expo'
    })
  }

  addEventListeners () {
    super.addEventListeners()


    this.onHeaderButtonClickEvent = this.onHeaderButtonClick.bind(this)

    this.elements.headerButton.addEventListener('click', this.onHeaderButtonClickEvent)
  }

  removeEventListeners () {
    super.removeEventListeners()

    this.elements.headerButton.removeEventListener('click', this.onHeaderButtonClickEvent)
  }
}
