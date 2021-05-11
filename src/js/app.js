import {settings, select, classNames, templates} from './settings.js';
import Product from './componets/Product.js';
import Cart from './componets/Cart.js';
import Booking from './componets/Booking.js';

const app = {
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

    thisApp.BookingElement = document.querySelector(select.containerOf.booking);
    thisApp.Booking = new Booking (thisApp.BookingElement);
  },

  init: function () {
    const thisApp = this;
    console.log('*** App starting ***');
    console.log('thisApp:', thisApp);
    console.log('classNames:', classNames);
    console.log('settings:', settings);
    console.log('templates:', templates);

    //thisApp.initPages();
    thisApp.initData();
    thisApp.initCart();
    thisApp.initBooking();
  },
};
app.init();