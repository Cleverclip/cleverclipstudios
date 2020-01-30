import { TimelineMax } from 'gsap'

import Page from 'classes/Page'

export default class extends Page {
  constructor () {
    super({ selector: '.question' })
  }

  create () {
    super.create()

    this.elements = {
      buttonExternal: document.querySelector('.question__header__button--external'),
      buttonInternal: document.querySelector('.question__header__button--internal')
    }
  }

  show (previous) {
    this.create()

    if (previous) {
      this.elements.buttonInternal.style.display = 'inline-block'
    } else {
      this.elements.buttonExternal.style.display = 'inline-block'
    }

    this.timelineIn = new TimelineMax()

    super.show(this.timelineIn)
  }

  hide () {
    this.timelineOut = new TimelineMax()

    super.hide(this.timelineOut)
  }
}
