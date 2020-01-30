import { TweenMax, TimelineMax } from 'gsap'
import { each, sample } from 'lodash'

export default class {
  constructor ({ items, list }) {
    this.columns = [
      {
        index: 0,
        items: [],
        isAnimating: false
      },
      {
        index: 0,
        items: [],
        isAnimating: false
      },
      {
        index: 0,
        items: [],
        isAnimating: false
      },
      {
        index: 0,
        items: [],
        isAnimating: false
      },
      {
        index: 0,
        items: [],
        isAnimating: false
      }
    ]

    this.height = 0

    this.items = items
    this.list = list

    this.create()

    this.createInterval()
  }

  create () {
    each(this.items, ({ clientHeight }) => {
      if (this.height < clientHeight) {
        this.height = clientHeight
      }
    })

    each(this.items, (item, index) => {
      const autoAlpha = index < 5 ? 1 : 0
      const left = index % 5 * 20

      TweenMax.set(item, {
        autoAlpha,
        height: '100%',
        left: `${left}%`,
        position: 'absolute',
        top: 0
      })

      this.columns[index % 5].items.push(item)
    })

    TweenMax.set(this.list, {
      height: this.height
    })
  }

  createInterval () {
    setInterval(() => {
      const column = sample(this.columns)

      if (!column.isAnimating) {
        column.isAnimating = true

        const timeline = new TimelineMax()

        timeline.to(column.items, 0.5, {
          autoAlpha: 0
        })

        timeline.to(column.items[column.index + 1], 0.5, {
          autoAlpha: 1
        })

        timeline.set({}, {}, '+= 1')

        timeline.call(() => {
          column.isAnimating = false
          column.index = (column.index + 1) % (column.items.length - 1)
        })
      }
    }, 500)
  }
}
