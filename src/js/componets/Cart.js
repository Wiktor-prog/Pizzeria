import {settings, select, classNames, templates} from '../settings.js';
import {utils} from '../utils.js';
import CartProduct from './CartProduct.js';




class Cart {
  constructor(element) {
    const thisCart = this;

    thisCart.products = [];

    thisCart.getElements(element);
    thisCart.initActions();
    //console.log('new Cart', thisCart);
  }
  getElements(element) {
    const thisCart = this;

    thisCart.dom = {};
    thisCart.dom.toggleTrigger = element.querySelector(
      select.cart.toggleTrigger
    );
    thisCart.dom.wrapper = element;
    thisCart.dom.productList = element.querySelector(select.cart.productList);
    thisCart.dom.deliveryFee = element.querySelector(select.cart.deliveryFee);
    thisCart.dom.subTotalPrice = element.querySelector(
      select.cart.subtotalPrice
    );
    thisCart.dom.totalPrice = element.querySelectorAll(select.cart.totalPrice);
    thisCart.dom.totalNumber = element.querySelector(select.cart.totalNumber);
    thisCart.dom.form = element.querySelector(select.cart.form);
    thisCart.dom.phone = element.querySelector(select.cart.phone);
    thisCart.dom.address = element.querySelector(select.cart.address);
  }
  initActions() {
    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener('click', function (event) {
      event.preventDefault();
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });
    thisCart.dom.productList.addEventListener('updated', function () {
      thisCart.update();
    });
    thisCart.dom.productList.addEventListener('remove', function (event) {
      thisCart.remove(event.detail.cartProduct);
    });
    thisCart.dom.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisCart.sendOrder();
    });
  }

  sendOrder() {
    const thisCart = this;
    const url = settings.db.url + '/' + settings.db.order;

    const payload = {};

    payload.address = thisCart.dom.address;
    payload.phone = thisCart.dom.phone;
    payload.totalPrice = thisCart.totalPrice;
    payload.subTotalPrice = thisCart.subTotalPrice;
    payload.totalNumber = thisCart.totalNumber;
    payload.deliveryFee = thisCart.deliveryFee;
    payload.products = [];

    for (let prod of thisCart.products) {
      payload.products.push(prod.getData());
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options);
  }
  add(menuProduct) {
    const thisCart = this;
    console.log('adding product', menuProduct);

    /* generate HTML based on template */
    const generatedHTML = templates.cartProduct(menuProduct);

    /* create elements using utils.createElementFromHTML */
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);

    /* add element to menu */
    thisCart.dom.productList.appendChild(generatedDOM);
    //console.log('thisCart.products', thisCart.products);

    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    console.log('thisCart.product', thisCart.products);
    thisCart.update();
  }
  update() {
    const thisCart = this;

    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;
    for (let product of thisCart.products) {
      thisCart.totalNumber = thisCart.totalNumber + product.menuProduct.amount;
      thisCart.subtotalPrice =
        thisCart.subtotalPrice + product.menuProduct.price;
    }

    thisCart.dom.subTotalPrice.innerHTML = thisCart.subtotalPrice;
    thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;
    thisCart.totalPrice = thisCart.subTotalPrice + thisCart.deliveryFee;

    console.log('totalPrice', thisCart.totalPrice);
    console.log('delifery', thisCart.deliveryFee);
    console.log('subtotal', thisCart.subTotalPrice);
    console.log('totalnumber', thisCart.totalNumber);
  }

  remove(cartProduct) {
    const thisCart = this;

    const IndexEl = thisCart.products.indexOf(cartProduct);
    thisCart.products.splice(IndexEl, 1);
    cartProduct.dom.wrapper.remove();
    thisCart.update();
  }
}

export default Cart;
