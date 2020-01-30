import { TweenMax } from 'gsap'

export default class {
  constructor ({ element }) {
    this.element = element

    this.onResize()
  }

  onResize () {
    TweenMax.set(this.element, {
      clearProps: 'all'
    })

    const { offsetLeft } = this.element.parentNode.parentNode

    TweenMax.set(this.element, {
      width: this.element.clientWidth + offsetLeft
    })
  }
}
