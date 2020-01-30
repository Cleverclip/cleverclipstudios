import { each } from 'lodash'

export default class {
  constructor ({ classes, buttons, list, items }) {
    this.classes = classes
    this.buttons = buttons
    this.list = list
    this.items = items

    this.filters = []

    this.addEventListeners()
  }

  onFilter ({ target }) {
    const { filter } = target.dataset

    const index = this.filters.indexOf(filter)

    if (index > -1) {
      target.classList.remove(this.classes.button)

      this.filters.splice(index, 1)
    } else {
      target.classList.add(this.classes.button)

      this.filters.push(filter)
    }

    each(this.items, item => {
      const industries = JSON.parse(item.dataset.filter)

      if (industries) {
        let isActive = false

        each(this.filters, filter => {
          const value = parseInt(filter, 10)

          if (industries.indexOf(value) > -1) {
            isActive = true
          }
        })

        if (isActive) {
          item.classList.add(this.classes.items)
        } else {
          item.classList.remove(this.classes.items)
        }
      }
    })

    if (this.filters.length !== 0) {
      this.list.classList.add(this.classes.list)
    } else {
      this.list.classList.remove(this.classes.list)
    }
  }

  addEventListeners () {
    this.onFilterEvent = this.onFilter.bind(this)

    each(this.buttons, button => {
      button.addEventListener('click', this.onFilterEvent)
    })
  }

  removeEventListeners () {
    each(this.buttons, button => {
      button.removeEventListener('click', this.onFilterEvent)
    })
  }

  destroy () {
    this.removeEventListeners()
  }
}
