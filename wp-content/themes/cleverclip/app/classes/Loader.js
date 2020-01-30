import { TweenMax } from 'gsap'

export default class Loader {
  constructor () {
    this.element = document.createElement('div')
    this.element.className = 'loader'

    this.element.innerHTML = `
      <svg class="loader__media" viewBox="0 0 120 120">
        <circle class="loader__media__spinner" cx="60" cy="60" r="50" />
        <circle class="loader__media__circle" cx="60" cy="60" r="50" />
      </svg>
    `

    this.show()
  }

  show () {
    document.body.appendChild(this.element)

    TweenMax.fromTo(this.element, 0.4, {
      autoAlpha: 0
    }, {
      autoAlpha: 1
    })
  }

  hide () {
    TweenMax.to(this.element, 0.4, {
      autoAlpha: 0,
      onComplete: () => {
        document.body.removeChild(this.element)
      }
    })
  }
}
