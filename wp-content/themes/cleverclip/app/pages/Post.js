import { TimelineMax } from 'gsap'

import Page from 'classes/Page'

export default class extends Page {
  constructor () {
    super({ selector: '.post' })
  }

  create () {
    super.create()

    this.elements = {

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
