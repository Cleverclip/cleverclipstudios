import Cookies from 'js-cookie'
import EventEmitter from 'events'
import LazyLoad from 'vanilla-lazyload'
import { TimelineMax } from 'gsap'
import { each, map, uniqBy } from 'lodash'

import EmbedVideo from './EmbedVideo'
import Height from './Height'
import ModalVideo from './ModalVideo'
import Product from './Product'

export default class extends EventEmitter {
  constructor ({ selector }) {
    super()

    this.selector = selector
  }

  create () {
    this.element = document.querySelector(this.selector)

    this.createHeights()
    this.createLazyLoad()
    this.createProducts()
    this.createUTM()
    this.createVideos()
  }

  createHeights () {
    const heights = document.querySelectorAll('[data-height]')
    const heightsClasses = uniqBy(map(heights, content => {
      return content.dataset.height
    }))

    this.heights = map(heightsClasses, elements => {
      const height = new Height({
        elements
      })

      return height
    })
  }

  createLazyLoad () {
    this.lazyload = new LazyLoad({
      threshold: 0
    })
  }

  createProducts () {
    const products = document.querySelectorAll('[data-product-media]')

    this.products = map(products, element => {
      const product = new Product({
        element
      })

      return product
    })
  }

  createUTM () {
    this.utms = document.querySelectorAll('input[name*="utm_"]')

    each(this.utms, utm => {
      const cookie = Cookies.get(utm.name)

      if (cookie) {
        utm.value = cookie
      }
    })

    this.refererer = document.querySelector('input[name="referrer"]')

    if (this.refererer) {
      this.refererer.value = Cookies.get('referrer')
    }
  }

  createScroll () {
    this.isScroll25 = false
    this.isScroll50 = false
    this.isScroll75 = false
    this.isScroll100 = false
  }

  createVideos () {
    this.embedVideos = document.querySelectorAll('[data-embed-video]')
    this.modalVideos = document.querySelectorAll('[data-modal-video]')
  }

  show (animation = new TimelineMax()) {
    return new Promise(resolve => {
      animation.call(() => {
        this.onResize()
      })

      animation.call(() => {
        resolve()
      })

      animation.call(() => {
        this.addEventListeners()
      })
    })
  }

  hide (animation = new TimelineMax()) {
    return new Promise(resolve => {
      animation.call(() => {
        this.destroy()
      })

      animation.call(() => {
        this.removeEventListeners()
      })

      animation.to(this.element, 0.5, {
        autoAlpha: 0
      })

      animation.call(() => {
        resolve()
      })
    })
  }

  onResize () {
    each(this.heights, height => {
      height.onResize()
    })

    each(this.products, product => {
      product.onResize()
    })
  }

  onScroll () {
    const current = ((document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop)
    const total = document.body.scrollHeight - window.innerHeight

    const percent = current / total

    if (!this.isScroll25 && percent >= 0.25) {
      this.isScroll25 = true

      ga('send', 'event', 'Scroll Tracking', '25%')
    } else if (!this.isScroll50 && percent >= 0.5) {
      this.isScroll50 = true

      ga('send', 'event', 'Scroll Tracking', '50%')
    } else if (!this.isScroll75 && percent >= 0.75) {
      this.isScroll75 = true

      ga('send', 'event', 'Scroll Tracking', '75%')
    } else if (!this.isScroll100 && percent >= 0.9) {
      this.isScroll100 = true

      ga('send', 'event', 'Scroll Tracking', '100%')
    }
  }

  onVideoEmbedOpen ({ target }) {
    new EmbedVideo({
      id: target.dataset.embedVideo,
      target
    })
  }

  onVideoModalOpen ({ target }) {
    new ModalVideo({
      id: target.dataset.modalVideo
    })
  }

  addEventListeners () {
    this.onResizeEvent = this.onResize.bind(this)
    this.onScrollEvent = this.onScroll.bind(this)

    window.addEventListener('resize', this.onResizeEvent)
    window.addEventListener('scroll', this.onScrollEvent)

    this.onVideoEmbedOpenEvent = this.onVideoEmbedOpen.bind(this)
    this.onVideoModalOpenEvent = this.onVideoModalOpen.bind(this)

    each(this.embedVideos, video => {
      video.addEventListener('click', this.onVideoEmbedOpenEvent)
    })

    each(this.modalVideos, video => {
      video.addEventListener('click', this.onVideoModalOpenEvent)
    })
  }

  removeEventListeners () {
    window.removeEventListener('resize', this.onResizeEvent)
    window.removeEventListener('scroll', this.onScrollEvent)

    each(this.embedVideos, video => {
      video.removeEventListener('click', this.onVideoEmbedOpenEvent)
    })

    each(this.modalVideos, video => {
      video.removeEventListener('click', this.onVideoModalOpenEvent)
    })
  }

  destroy () {

  }
}
