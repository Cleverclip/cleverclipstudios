import { EventEmitter } from 'events'
import { TimelineMax, Power4 } from 'gsap'
import Player from '@vimeo/player'

export default class extends EventEmitter {
  constructor ({ id }) {
    super()

    this.link = `https://player.vimeo.com/video/${id}?autoplay=1&loop=1&color=F3D300&title=0&byline=0&portrait=0`

    this.element = document.createElement('div')
    this.element.className = 'popup'
    this.element.innerHTML = `
      <div class="popup__wrapper">
        <button class="popup__button">
          Close
        </button>

        <iframe class="popup__player" src="${this.link}" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
      </div>
    `

    this.elements = {
      wrapper: this.element.querySelector('.popup__wrapper'),
      player: this.element.querySelector('.popup__player'),
      button: this.element.querySelector('.popup__button')
    }

    this.player = new Player(this.element)

    document.body.style.overflow = 'hidden'
    document.body.appendChild(this.element)

    this.createTimelineIn()
    this.createTimelineOut()

    this.elements.player.onload = () => {
      this.timelineIn.play()
    }

    this.addEventListeners()
  }

  createTimelineIn () {
    this.timelineIn = new TimelineMax({
      paused: true
    })

    this.timelineIn.fromTo(this.element, 0.5, {
      autoAlpha: 0
    }, {
      autoAlpha: 1
    })

    this.timelineIn.fromTo(this.elements.player, 0.5, {
      autoAlpha: 0,
      scale: 1.2
    }, {
      autoAlpha: 1,
      ease: Power4.easeOut,
      scale: 1
    }, '-= 0.1')

    this.timelineIn.fromTo(this.elements.button, 0.5, {
      autoAlpha: 0,
      scale: 1.2
    }, {
      autoAlpha: 1,
      ease: Power4.easeOut,
      scale: 1
    }, '-= 0.5')
  }

  createTimelineOut () {
    this.timelineOut = new TimelineMax({
      paused: true
    })

    this.timelineOut.to(this.elements.button, 0.5, {
      autoAlpha: 0,
      ease: Power4.easeOut,
      scale: 0.8
    })

    this.timelineOut.to(this.elements.player, 0.5, {
      autoAlpha: 0,
      ease: Power4.easeOut,
      scale: 0.8
    }, '-= 0.5')

    this.timelineOut.to(this.element, 0.5, {
      autoAlpha: 0
    }, '-= 0.1')

    this.timelineOut.call(() => {
      this.removeEventListeners()

      document.body.style.overflow = ''
      document.body.removeChild(this.element)
    })
  }

  onClose () {
    this.timelineOut.play()
  }

  onBlur () {
    this.player.pause()
  }

  addEventListeners () {
    this.onCloseEvent = this.onClose.bind(this)

    this.elements.button.addEventListener('click', this.onCloseEvent)

    this.onBlurEvent = this.onBlur.bind(this)

    window.addEventListener('blur', this.onBlurEvent)
  }

  removeEventListeners () {
    this.elements.button.removeEventListener('click', this.onCloseEvent)

    window.removeEventListener('blur', this.onBlurEvent)
  }
}
