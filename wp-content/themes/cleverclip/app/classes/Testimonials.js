import EventEmitter from 'events'
import { Expo, TimelineMax } from 'gsap'
import { each } from 'lodash'

import { getOffset } from 'utils/dom'
import { calculate, split } from 'utils/text'

export default class extends EventEmitter {
  constructor ({ classes, element, elements }) {
    super()
    
    this.classes = classes
    this.element = element

    this.elements = elements
    this.elements.descriptionsSpans = []

    each(this.elements.descriptions, element => {
      const spans = split({ element })

      this.elements.descriptionsSpans.push(spans)
    })

    this.index = 0
    this.isAnimating = false

    this.threshold = window.innerWidth < 768 ? 1 : 0.85

    this.change(this.index)

    this.addEventListeners()
  }

  change (index) {
    if (this.timeline) {
      this.timeline.kill()
      this.timeline = null
    }

    const currentItem = this.elements.items[this.index]

    const selectedItem = this.elements.items[index]
    const selectedItemMedia = this.elements.medias[index]
    const selectedItemDescriptionSpans = calculate(this.elements.descriptionsSpans[index])
    const selectedAuthorTitle = this.elements.authorTitles[index]
    const selectedAuthorDescription = this.elements.authorDescriptions[index]
    const selectedAuthorImage = this.elements.authorImages[index]

    this.timeline = new TimelineMax()

    this.timeline.call(() => {
      each(this.elements.paginations, (pagination, paginationIndex) => {
        if (index === paginationIndex) {
          pagination.classList.add(this.classes.paginationsActive)
        } else {
          pagination.classList.remove(this.classes.paginationsActive)
        }
      })
    })

    this.timeline.to(currentItem, 0.4, {
      autoAlpha: 0
    })

    this.timeline.set(selectedItem, {
      autoAlpha: 1
    })

    this.timeline.fromTo(selectedItemMedia, 1.5, {
      autoAlpha: 0,
      scale: 1.2
    }, {
      autoAlpha: 1,
      ease: Expo.easeOut,
      scale: 1
    })

    this.timeline.staggerFromTo(selectedItemDescriptionSpans, 1.5, {
      autoAlpha: 0,
      y: '100%'
    }, {
      autoAlpha: 1,
      ease: Expo.easeOut,
      y: '0%'
    }, 0.1, '-= 1.4')

    this.timeline.fromTo(selectedAuthorTitle, 1.5, {
      autoAlpha: 0,
      y: '100%'
    }, {
      autoAlpha: 1,
      ease: Expo.easeOut,
      y: '0%'
    }, '-= 1.4')

    this.timeline.fromTo(selectedAuthorDescription, 1.5, {
      autoAlpha: 0,
      y: '100%'
    }, {
      autoAlpha: 1,
      ease: Expo.easeOut,
      y: '0%'
    }, '-= 1.4')

    this.timeline.fromTo(selectedAuthorImage, 1.5, {
      autoAlpha: 0,
      scale: 1.2
    }, {
      autoAlpha: 1,
      ease: Expo.easeOut,
      scale: 1
    }, '-= 1.4')

    this.index = index
  }

  onChange ({ target }) {
    const index = parseInt(target.dataset.index, 10)
    if (this.index === index) {
      return
    }

    this.change(index)
  }

  onNext () {
    const index = this.index === this.elements.items.length - 1 ? 0 : this.index + 1

    if (this.index === index) {
      return
    }

    this.change(index)
  }

  onPrevious () {
    const index = this.index === 0 ? this.elements.items.length - 1 : this.index - 1

    if (this.index === index) {
      return
    }

    this.change(index)
  }

  addEventListeners () {
    
    this.onPreviousEvent = this.onPrevious.bind(this)
    this.onNextEvent = this.onNext.bind(this)

    if(this.elements.buttonNext)this.elements.buttonNext.addEventListener('click', this.onNextEvent)
    if(this.elements.buttonPrevious)this.elements.buttonPrevious.addEventListener('click', this.onPreviousEvent)

    this.onChangeEvent = this.onChange.bind(this)
    each(this.elements.paginations, pagination => {
      pagination.addEventListener('click', this.onChangeEvent)
    })
  }

  removeEventListeners () {
    this.elements.buttonNext.removeEventListener('click', this.onNextEvent)
    this.elements.buttonPrevious.removeEventListener('click', this.onPreviousEvent)

    each(this.elements.paginations, pagination => {
      pagination.removeEventListener('click', this.onChangeEvent)
    })
  }

  destroy () {
    this.removeEventListeners()
  }
}
