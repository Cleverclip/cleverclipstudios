import { TimelineMax, TweenMax, Power4 } from "gsap";
import { each } from "lodash";

import Page from 'classes/Page';

export default class extends Page {
  constructor () {
    super({ selector: '.blog' });
  }

  create () {
    super.create();

    this.elements = {
    	loadMorePostsBtn: document.querySelectorAll('.loadMoreButton a'),

    }

    this.addEventListeners()
  }

  show () {
    this.create()

    this.timelineIn = new TimelineMax()

    super.show(this.timelineIn)
  }

  hide () {
    this.timelineOut = new TimelineMax()

    super.hide(this.timelineOut)
  }
  
  onLoadMoreBtn (event) {
	  event.preventDefault();
	  
	  var sourceElement = event.target || event.srcElement;
	  var sourceParent = sourceElement.closest(".loadMoreButton");
	  var targetElementID = sourceParent.dataset.targetblockid;

	  if (targetElementID) {
		  var targetElement = document.querySelector('#'+targetElementID+' .uael-post__load-more');
		  
		  if (targetElement) {
			  targetElement.click();
		  }
		  
	  }
  }
  
  addEventListeners () {
    super.addEventListeners();
    
    this.onLoadMoreBtnEvent = this.onLoadMoreBtn.bind(this);
    
    if (this.elements.loadMorePostsBtn) {
    	 each(this.elements.loadMorePostsBtn, item => {
	      item.addEventListener('click', this.onLoadMoreBtnEvent)
	    })
    }
   

  }

}
