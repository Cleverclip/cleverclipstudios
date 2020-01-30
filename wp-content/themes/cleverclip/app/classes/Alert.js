import { Power4, TweenMax } from 'gsap'

export default class {
  constructor ({ autohide = true, description, title, type = 'success' }) {
    this.element = document.createElement('aside')
    this.element.className = `alert alert--${type}`
    this.element.innerHTML = `
      <button class="alert__button">
        Close
      </button>

      <div class="alert__wrapper">
        <h1 class="alert__title">
          ${title}
        </h1>

        <p class="alert__description">
          ${description}
        </p>
      </div>
    `

    this.elements = {
      button: this.element.querySelector('.alert__button')
    }

    this.addEventListeners()
    this.show()

    if (autohide) {
      setTimeout(() => this.hide(), 10000)
    }
  }

  show () {
    document.body.appendChild(this.element)

    TweenMax.fromTo(this.element, 1.5, {
      y: '100%'
    }, {
      ease: Power4.easeInOut,
      y: '0%'
    })
  }

  hide () {
    TweenMax.to(this.element, 1.5, {
      ease: Power4.easeInOut,
      onComplete: () => {
        this.destroy()

        document.body.removeChild(this.element)
      },
      y: '100%'
    })
  }

  addEventListeners () {
    this.onHideEvent = this.hide.bind(this)

    this.element.addEventListener('click', this.onHideEvent)
  }

  removeEventListeners () {
    this.element.removeEventListener('click', this.onHideEvent)
  }

  destroy () {
    this.removeEventListeners()
  }
}
