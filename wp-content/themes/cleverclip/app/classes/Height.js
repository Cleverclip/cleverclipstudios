import { TweenMax } from 'gsap'
import { each } from 'lodash'

export default class {
  constructor ({ elements }) {
    this.elements = document.querySelectorAll(elements)

    this.onResize()
  }

  onResize () {
    TweenMax.set(this.elements, {
      clearProps: 'all'
    })

    let height = 0

    each(this.elements, ({ clientHeight }) => {
      if (height < clientHeight) {
        height = clientHeight
      }
    })

    each(this.elements, element => {
      TweenMax.set(element, {
        height
      })
    })
  }
}
