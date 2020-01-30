import { TimelineMax } from 'gsap'

import Page from 'classes/Page'
import Industries from 'classes/Industries'

export default class extends Page {
  constructor () {
    super({ selector: '.industries' })
  }

  create () {
    super.create()

    this.elements = {
      clientsButtons: document.querySelectorAll('.industries__clients__filter__button'),
      clientsList: document.querySelector('.industries__clients__list'),
      clientsItems: document.querySelectorAll('.industries__clients__item')
    }

    this.createIndustries()
  }

  createIndustries () {
    this.industries = new Industries({
      classes: {
        button: 'industries__clients__filter__button--active',
        list: 'industries__clients__list--filtered',
        items: 'industries__clients__item--active'
      },
      buttons: this.elements.clientsButtons,
      list: this.elements.clientsList,
      items: this.elements.clientsItems
    })
  }

  destroyIndustries () {
    this.industries.destroy()
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

  destroy () {
    super.destroy()

    this.destroyIndustries()
  }
}
