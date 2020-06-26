import EventEmitter from "events";
import { TweenMax } from "gsap";
import { each } from "lodash";

export default class extends EventEmitter {
  constructor() {
    super();

    this.elements = {
      mobile: {
        root: document.querySelector(".topics_menu__mobile"),

        open: document.querySelector(".loadMoreTopicsButton a"),
        back: document.querySelector(".topics_menu__mobile .topics_menu__mobile__header__button--back"),

      }
    };

    this.addEventListeners();
  }

  onMobileClose() {

    TweenMax.to(this.elements.mobile.root, 1, {
      ease: Power4.easeInOut,
      x: "-100%"
    });

  }

  onMobileOpen() {
    TweenMax.to(this.elements.mobile.root, 1, {
      ease: Power4.easeInOut,
      x: "0%"
    });
  }

  addEventListeners() {
	if (this.elements.mobile.open) {

	    this.onMobileOpenEvent = this.onMobileOpen.bind(this);

	    this.elements.mobile.open.addEventListener("click", this.onMobileOpenEvent);
	}
	
	if (this.elements.mobile.back) {
		
		this.onMobileCloseEvent = this.onMobileClose.bind(this);

	    this.elements.mobile.back.addEventListener("click", this.onMobileCloseEvent);
	}

    

  }
}
