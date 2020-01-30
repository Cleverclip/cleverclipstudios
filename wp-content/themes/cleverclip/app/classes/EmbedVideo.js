import { EventEmitter } from 'events'
import { TweenMax } from 'gsap'
import Player from '@vimeo/player'

export default class extends EventEmitter {
  constructor ({ id, target }) {
    super()

    this.element = document.createElement('iframe')
    this.element.className = 'embed'

    this.element.src = `https://player.vimeo.com/video/${id}?autoplay=1&loop=1&color=F3D300&title=0&byline=0&portrait=0`

    this.element.setAttribute('allow', 'autoplay; fullscreen')
    this.element.setAttribute('allowfullscreen', '')
    this.element.setAttribute('frameborder', '0')

    this.player = new Player(this.element)

    TweenMax.set(this.element, {
      autoAlpha: 0
    })

    this.element.onload = () => {
      TweenMax.fromTo(this.element, 1, {
        autoAlpha: 0
      }, {
        autoAlpha: 1
      })
    }

    target.parentNode.appendChild(this.element)

    this.addEventListeners()
  }

  onBlur () {
    this.player.pause()
  }

  addEventListeners () {
    this.onBlurEvent = this.onBlur.bind(this)

    window.addEventListener('blur', this.onBlurEvent)
  }
}
