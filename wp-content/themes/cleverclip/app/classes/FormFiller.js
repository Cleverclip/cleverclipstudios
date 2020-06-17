import Cookie from "js-cookie";
import QueryString from "query-string";
import {each} from "lodash";

const COOKIE_EXP_DAYS = 30;
const REFERRER_COOKIE_NAME = "referrer";
const FORM_FIELD_CLASS_PREFIX = "submission-value__";

const FIELDS = {
  language: "language",
  country: "country",
  referrer: "referrer",
  utm_source: "utm_source",
  utm_medium: "utm_medium",
  utm_campaign: "utm_campaign",
  utm_content: "utm_content",
  utm_term: "utm_term"
};


/**
 * Does 2 things:
 * - Writes the the last external referrer and utm params to cookies, and keeps them for 'COOKIE_EXP_DAYS' days
 * - Fills out hidden form fields for language, country (both from meta tags), referrer, and utm params (from cookies)
 */
export default class FormFiller {

  static fillFormField(field, content) {
    if (field.tagName === "INPUT")
      field.value = content;
    else {
      const input = field.querySelector("input");
      if (input) input.value = content;
    }
  }

  static create() {
    // create referrer cookie
    if (!Cookie.get(REFERRER_COOKIE_NAME) && !document.referrer.includes(document.location.hostname))
      Cookie.set(REFERRER_COOKIE_NAME, document.referrer, {expires: COOKIE_EXP_DAYS});

    // create utm cookies
    each(QueryString.parse(window.location.search), (value, key) => {
      if (key.includes("utm") && !Cookie.get(key))
        Cookie.set(key, value, {
          expires: COOKIE_EXP_DAYS
        });
    });
  }

  static fillFormFields() {
    Object.values(FIELDS).forEach(value => {
      const fields = document.querySelectorAll(`.${FORM_FIELD_CLASS_PREFIX}${value}`);
      if (fields.length > 0) {
        if (value === FIELDS.language || value === FIELDS.country) {
          const meta = document.querySelector(`meta[name="${value}"]`);
          if (meta)
            fields.forEach(field => FormFiller.fillFormField(field, meta.getAttribute("content")));
        }

        if (value === FIELDS.referrer || value.includes("utm")) {
          const cookie = Cookie.get(value);
          if (cookie)
            fields.forEach(field => FormFiller.fillFormField(field, cookie));
        }
      }
    })
  }
}