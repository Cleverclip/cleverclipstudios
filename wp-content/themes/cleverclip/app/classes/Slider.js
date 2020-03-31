import EventEmitter from 'events'
import { each } from 'lodash'
import prefix from 'prefix'

import { getOffset } from 'utils/dom'

export default class extends EventEmitter {
  constructor ({ element, elements }) {
    super()

    this.element = element
    this.elements = elements

    this.prefix = prefix('transform')

    this.isPhone = window.innerWidth < 768

    this.index = 0

    this.scroll = {
      position: 0,
      current: 0,
      target: 0,
      last: 0,
      startY:0,
      y:0,
      lock: false,
      started : false,
    }

    each(this.elements.buttons, button => {
      button.offset = getOffset(button).left
      button.position = 0
      button.width = button.getBoundingClientRect().width
    })

    this.length = this.elements.buttons.length

    this.width = this.elements.buttons[0].width
    this.widthTotal = this.element.getBoundingClientRect().width
    this.widthTotalHalf = this.widthTotal / 2

    this.onCheck()
    this.onSet()

    this.addEventListeners()
  }

  enable () {
    this.update()
  }

  disable () {
    window.cancelAnimationFrame(this.frame)
  }

  reset () {
    TweenMax.to(this.scroll, 0.5, {
      onComplete: () => {
        TweenMax.delayedCall(0.5, () => this.disable())
      },
      target: 0
    })
  }

  onDown (event) {
    this.isDown = true
    this.scroll.started = false
    this.scroll.position = this.scroll.current
    
    this.start = event.touches ? event.touches[0].clientX : event.clientX
    this.scroll.startY = event.touches ? window.event.touches[0].screenY : window.event.screenY
    this.scroll.lock = false
  }

  onMove (event) {
    if (!this.isDown) {
      return
    }

    const x = event.touches ? event.touches[0].clientX : event.clientX
    const distance = (this.start - x) * 3
    this.scroll.y = event.touches ? window.event.touches[0].screenY : window.event.screenY
    this.scroll.target = this.scroll.position + distance

    const distX = Math.abs(this.scroll.position - this.scroll.current)
    const distY = Math.abs(this.scroll.y - this.scroll.startY)

    if(distY > distX)this.scroll.lock = true
    
  }

  onUp (event) {
    this.isDown = false

    this.onCheck()
    this.scroll.y = 0
    this.scroll.startY = 0
  }

  onWheel (event) {
    let delta = -event.wheelDeltaY || event.deltaY
    let speed = 75

    if (delta < 0) {
      speed *= -1
    }

    this.scroll.target += speed
  }

  onCheck () {
    const itemIndex = Math.floor(Math.abs(this.scroll.target) / this.width)
    const item = this.width * itemIndex

    if (this.scroll.target < 0) {
      this.scroll.target = -item
    } else {
      this.scroll.target = item
    }
  }

  onSet () {
    this.scroll.current = this.scroll.target
  }

  transform (element, x) {
    element.style[this.prefix] = `matrix(1, 0, 0, 1, ${x}, 0)`
  }

  update () {

    
    

    
    this.scroll.current += (this.scroll.target - this.scroll.current) * 0.1
    let index = Math.floor(this.scroll.current + this.widthTotalHalf) % this.widthTotal

    index = Math.floor(index / this.widthTotal * this.length)

    if (index < 0) {
      index = (this.length - Math.abs(index % this.length)) % this.length
    }

    if (this.index !== index) {
      this.index = index

      this.emit('change', index)
    }
    
    // if(!this.scroll.started){
    //   this.scroll.started = true
    //   this.scroll.current = this.scroll.current - (this.scroll.current - this.scroll.position)
    // }
    if(!this.scroll.lock){
      each(this.elements.items, item => {
        this.transform(item, -this.scroll.current)
      })
    }
    

    if (this.scroll.current < this.scroll.last) {
      this.direction = 'right'
    } else {
      this.direction = 'left'
    }

    each(this.elements.buttons, element => {
      const position = (element.offset + element.position + element.clientWidth - this.scroll.current)

      element.isBefore = position < 0
      element.isAfter = position > this.widthTotal

      if (this.direction === 'left' && element.isBefore) {
        element.position = element.position + this.widthTotal

        element.isBefore = false
        element.isAfter = false
      }

      if (this.direction === 'right' && element.isAfter) {
        element.position = element.position - this.widthTotal

        element.isBefore = false
        element.isAfter = false
      }

      this.transform(element, element.position)
    })

    this.scroll.last = this.scroll.current

    this.frame = requestAnimationFrame(this.update.bind(this))
  }

  onResize () {
    this.scroll = {
      position: 0,
      current: 0,
      target: 0,
      last: 0
    }

    each(this.elements.items, item => {
      TweenMax.set(item, {
        clearProps: 'x'
      })
    })

    each(this.elements.buttons, button => {
      button.offset = getOffset(button).left
      button.position = 0
      button.width = button.getBoundingClientRect().width

      TweenMax.set(button, {
        clearProps: 'x'
      })
    })

    this.width = this.elements.items[0].clientWidth
    this.widthTotal = this.element.getBoundingClientRect().width

    this.onCheck()
    this.onSet()
  }

  addEventListeners () {
    this.onDownEvent = this.onDown.bind(this)
    this.onMoveEvent = this.onMove.bind(this)
    this.onUpEvent = this.onUp.bind(this)

    this.element.addEventListener('mousedown', this.onDownEvent)
    this.element.addEventListener('mousemove', this.onMoveEvent)
    this.element.addEventListener('mouseup', this.onUpEvent)

    this.element.addEventListener('touchstart', this.onDownEvent)
    this.element.addEventListener('touchmove', this.onMoveEvent)
    this.element.addEventListener('touchend', this.onUpEvent)

    this.onResizeEvent = this.onResize.bind(this)

    window.addEventListener('resize', this.onResizeEvent)
  }

  removeEventListeners () {
    this.element.removeEventListener('mousedown', this.onDownEvent)
    this.element.removeEventListener('mousemove', this.onMoveEvent)
    this.element.removeEventListener('mouseup', this.onUpEvent)

    this.element.removeEventListener('touchstart', this.onDownEvent)
    this.element.removeEventListener('touchmove', this.onMoveEvent)
    this.element.removeEventListener('touchend', this.onUpEvent)
  }

  destroy () {
    this.removeEventListeners()
  }
}
