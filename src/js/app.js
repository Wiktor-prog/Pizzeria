import {settings, select, classNames} from './settings.js';
import Cart from './components/Cart.js';
import Product from './components/Product.js';
import Booking from './components/Booking.js';
import Home from './components/Home.js';

const app = {
  initPages: function (){
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);

    const idFromHash = window.location.hash.replace('#/', '');
    
    let pageMatchingHash = thisApp.pages[0].id;

    for(let page of thisApp.pages){
      if(page.id == idFromHash){
        pageMatchingHash = page.id;
        break;
      }
    }
    
    thisApp.activatePage(pageMatchingHash);

    for(let link of thisApp.navLinks){
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();

        /* get page id from href attribute */ 
        const id = clickedElement.getAttribute('href').replace('#', '');

        /* runn thisApp.activatePage with that id */
        thisApp.activatePage(id);

        /* change URL hash */
        window.location.hash = '#/' + id;
      });
    }
  },

  initMenu: function () {
    const thisApp = this;

    console.log('thisApp.data:', thisApp.data);
    for (let productData in thisApp.data.products) {
      new Product(
        thisApp.data.products[productData].id,
        thisApp.data.products[productData]
      );
    }
  },

  activatePage: function(pageId){
    const thisApp = this;

    /*add class "active" to matchng pages, remove from non-matching */
    for(let page of thisApp.pages){
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }

    /*add class "active" to matchng LInks, remove from non-matching */
    for(let link of thisApp.navLinks){
      link.classList.toggle(
        classNames.nav.active, 
        link.getAttribute('href') == '#' + pageId
      );
    }
  },

  initData: function () {
    const thisApp = this;

    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.product;

    fetch(url)
      .then(function (rawResponse) {
        return rawResponse.json();
      })
      .then(function (parsedResponse) {
        console.log('parsedResponse', parsedResponse);

        /*save parsedResponse as thisApp.data.products */
        thisApp.data.products = parsedResponse;

        /* execute initMenu method */
        thisApp.initMenu();
      });
    console.log('thisApp.data', JSON.stringify(thisApp));
  },

  initCart: function () {
    const thisApp = this;

    const cartElemement= document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElemement);
    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function (event) {
      app.cart.add(event.detail.product);
    });
  },

  initBooking: function(){
    const thisApp = this;

    const element = document.querySelector(select.containerOf.booking);
    thisApp.booking = new Booking(element);
  },

  initHomepage: function(){
    const thisApp = this;

    const element = document.querySelector(select.containerOf.home);
    thisApp.homepage = new Home(element);
  },

  init: function () {
    const thisApp = this;
    //console.log('*** App starting ***');
    //console.log('thisApp:', thisApp);
    //console.log('classNames:', classNames);
    //console.log('settings:', settings);
    //console.log('templates:', templates);

    thisApp.initPages();

    thisApp.initData();
    thisApp.initMenu();
    thisApp.initCart();
    thisApp.initBooking();
    thisApp.initHomepage();
  },
};
app.init();