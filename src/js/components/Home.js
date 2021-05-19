import {select, templates} from '../settings.js';

class Home {
  constructor(element) {
    const thisHome = this;

    thisHome.getElements(element);
    thisHome.initCarousel();
  }

  getElements(element) {
    const thisHome = this;
    thisHome.dom = {};
    thisHome.dom.wrapper = element;

    thisHome.dom.flickityWrapper = document.querySelector('.carousel');
  }
  initCarousel() {
    const thisHome = this;

    const flkty = new Flickity( thisHome.dom.flickitycarousel, {
      pageDots: false,
      cellAlign: 'left',
      contain: true,
      pageDots: false,
      cellAlign: 'left',
      contain: true
    });
    
  }
}

export default Home;
