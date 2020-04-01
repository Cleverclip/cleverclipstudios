import { each, last } from 'lodash'

import Alert from 'classes/Alert'

import { post } from 'utils/ajax'

export default class {
  constructor({ button, classes, form }) {
    this.button = button
    this.classes = classes
    this.form = form
    this.fields = this.form.querySelectorAll('input, select, textarea')
    this.subject = this.form.querySelector('[name="subject"]')

    this.addEventListeners()
    console.log('form init okey')
  }

  onSubmit (event) {
    event.preventDefault()

    each(this.fields, field => {
      field.classList.remove(this.classes.error)
    })

    const data = new FormData(this.form)

    let params = new URLSearchParams(data).toString()

    params = params.replace('newsletter=on', 'newsletter=Yes')
    params = params.replace('newsletter=off', 'newsletter=No')

    post(`/wp-json/contact-form-7/v1/contact-forms/${this.form.dataset.id}/feedback`, params).then(response => {
      const { invalidFields, message = '', status } = JSON.parse(response)

      if (invalidFields) {
        each(invalidFields, ({ into }) => {
          const element = document.querySelector(`[name=${last(into.split('.'))}]`)

          element.classList.add(this.classes.error)
        })
      }

      if (status === 'mail_sent') {
        this.form.reset()

        const { successDescription, successTitle } = this.form.dataset

        new Alert({
          description: successDescription,
          title: successTitle
        })

        ga('send', 'event', 'Website Contact', this.subject.value)
      } else if (status === 'mail_failed') {
        const { errorDescription, errorTitle } = this.form.dataset

        new Alert({
          description: errorDescription,
          title: errorTitle,
          type: 'error'
        })
      }
    })
  }

  addEventListeners () {
    this.onSubmitEvent = this.onSubmit.bind(this)

    this.button.addEventListener('click', this.onSubmitEvent)
  }

  removeEventListeners () {
    this.button.removeEventListener('click', this.onSubmitEvent)
  }

  destroy () {
    this.removeEventListeners()
  }
}
