import { Power4, TweenMax } from 'gsap'
import Cookies from 'js-cookie'

export default class {
  constructor () {
    this.element = document.querySelector('.cookies')

    const isAccepted = Cookies.get('isAccepted')

    if (!isAccepted) {
      this.show()
      this.addEventListeners()
    }
  }

  show () {
    TweenMax.fromTo(this.element, 1, {
      y: '100%'
    }, {
      ease: Power4.easeOut,
      y:  '0%'
    })
  }

  hide () {
    Cookies.set('isAccepted', true, { expires: 365 })

    TweenMax.to(this.element, 1, {
      ease: Power4.easeOut,
      y: '100%'
    })

    this.removeEventListeners()
  }

  addEventListeners () {
    this.hideEvent = this.hide.bind(this)

    this.element.addEventListener('click', this.hideEvent)
  }

  removeEventListeners () {
    this.element.removeEventListener('click', this.hideEvent)
  }
}
