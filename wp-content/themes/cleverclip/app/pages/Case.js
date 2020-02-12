import { TimelineMax, TweenMax } from "gsap";
import { each } from "lodash";
import Player from "@vimeo/player";

import Page from "classes/Page";

import { Detection } from "classes/Detection";

export default class extends Page {
  constructor() {
    super({ selector: ".case" });
  }

  create() {
    super.create();

    this.elements = {
      contentsSides: document.querySelectorAll(
        ".case__content--left, .case__content--right"
      ),
      contentPlayers: document.querySelectorAll(".case__video__iframe")
    };

    if (Detection.isDesktop) {
      this.createContents();
    }

    this.createPlayers();
  }

  createContents() {
    each(this.elements.contentsSides, side => {
      TweenMax.set(side, {
        clearProps: "all"
      });

      const { clientHeight, nextElementSibling, previousElementSibling } = side;

      if (nextElementSibling.classList.contains("case__media")) {
        TweenMax.set(side, {
          marginBottom: -clientHeight / 2
        });
      }

      if (previousElementSibling.classList.contains("case__media")) {
        TweenMax.set(side, {
          marginTop: -clientHeight / 2
        });
      }
    });
  }

  createPlayers() {
    each(this.elements.contentPlayers, element => {
      const button = element.nextElementSibling;
      console.log(element);
      const player = new Player(element);

      button.addEventListener("click", () => {
        console.log(player);
        player.play();

        TweenMax.to(button, 1, {
          autoAlpha: 0,
          pointerEvents: "none"
        });
      });
    });
  }

  onResize() {
    if (Detection.isDesktop) {
      this.createContents();
    }
  }

  show() {
    this.create();

    this.timelineIn = new TimelineMax();

    super.show(this.timelineIn);
  }

  hide() {
    this.timelineOut = new TimelineMax();

    super.hide(this.timelineOut);
  }

  addEventListeners() {
    super.addEventListeners();

    this.onResizeEvent = this.onResize.bind(this);

    window.addEventListener("resize", this.onResizeEvent);
  }

  removeEventListeners() {
    super.removeEventListeners();

    window.removeEventListener("resize", this.onResizeEvent);
  }
}
