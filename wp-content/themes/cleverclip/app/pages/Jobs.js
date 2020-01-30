import { TimelineMax } from 'gsap'
import { each } from 'lodash'

import Page from 'classes/Page'

export default class extends Page {
  constructor () {
    super({ selector: '.jobs' })
  }

  create () {
    super.create()

    this.elements = {
      titles: document.querySelectorAll('.jobs__about__content h3')
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

  onTitleToggle ({ target }) {
    if (target.classList.contains('checked')) {
      target.classList.remove('checked')
    } else {
      target.classList.add('checked')
    }
  }

  addEventListeners () {
    super.addEventListeners()

    this.onTitleToggleEvent = this.onTitleToggle.bind(this)

    each(this.elements.titles, title => {
      title.classList.add('checked')

      title.addEventListener('click', this.onTitleToggleEvent)
    })
  }
}
