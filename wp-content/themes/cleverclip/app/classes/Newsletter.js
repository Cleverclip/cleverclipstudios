import Alert from "classes/Alert";
import Loader from "classes/Loader";

import { post } from "utils/ajax";

export default class {
  constructor({ button, classes, form, input }) {
    this.button = button;
    this.classes = classes;
    this.form = form;
    this.input = input;

    this.addEventListeners();
  }

  onSubmit(event) {
    event.preventDefault();

    this.input.classList.remove(this.classes.input);

    const data = new FormData(this.form);
    const params = new URLSearchParams(data).toString();

    this.loader = new Loader();

    post(
      `/wp-json/contact-form-7/v1/contact-forms/${this.form.dataset.id}/feedback`,
      params
    ).then(response => {
      const { invalidFields, message = "", status } = JSON.parse(response);

      if (invalidFields) {
        this.input.classList.add(this.classes.input);
      }

      if (status === "mail_sent") {
        this.form.reset();

        const { successDescription, successTitle } = this.form.dataset;

        new Alert({
          description: successDescription,
          title: successTitle
        });

        ga("send", "event", "Newsletter", "Signup");
      } else if (status === "mail_failed") {
        const { errorDescription, errorTitle } = this.form.dataset;

        new Alert({
          description: errorDescription,
          title: errorTitle,
          type: "error"
        });
      }

      this.loader.hide();
    });
  }

  addEventListeners() {
    this.onSubmitEvent = this.onSubmit.bind(this);

    this.button.addEventListener("click", this.onSubmitEvent);
  }

  removeEventListeners() {
    this.button.removeEventListener("click", this.onSubmitEvent);
  }

  destroy() {
    this.removeEventListeners();
  }
}
