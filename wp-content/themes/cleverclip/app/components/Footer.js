import EventEmitter from 'events'

export default class extends EventEmitter {
  constructor () {
    super()

    this.element = document.querySelector('.footer')

    this.elements = {
      locales: document.querySelector('.footer__menu__language__group__select--locales')
    }

    this.addEventListeners()
  }

  onLocalesToggle ({ target }) {
    const { value } = target

    window.location.href = value
  }

  addEventListeners () {
    this.onLocalesToggleEvent = this.onLocalesToggle.bind(this)

    this.elements.locales.addEventListener('change', this.onLocalesToggleEvent)
  }
}
