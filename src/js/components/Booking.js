/* eslint-disable no-unused-vars */
import {select, templates , settings, classNames} from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';
class Booking {
  constructor(wrapper) {
    const thisBooking = this;

    thisBooking.render(wrapper);
    thisBooking.initWidgets();
    thisBooking.getData();
    thisBooking.initTable();

    //console.log('thisBooking', thisBooking);
    //console.log('wrapper', wrapper);
  }

  getData(){
    const thisBooking = this;

    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);
    const nonRepearParam = settings.db.notRepeatParam;
    const repeatParam = settings.db.repeatParam;

    const params = {
      booking: [
        startDateParam, 
        endDateParam,
      ],
      eventsCurrent: [
        nonRepearParam,
        startDateParam, 
        endDateParam,
      ],
      eventsRepeat: [
        repeatParam,
        endDateParam,
      ],
    };

    console.log('getData params', params);

    const urls = {
      booking:       settings.db.url + '/' + settings.db.booking
                                     + '?' + params.booking.join('&'),
      eventsCurrent: settings.db.url + '/' + settings.db.event
                                     + '?' + params.eventsCurrent.join('&'),
      eventsRepeat:  settings.db.url + '/' + settings.db.event
                                     + '?' + params.eventsRepeat.join('&'),
    };

    //console.log('getData urls', urls);

    Promise.all([
      fetch(urls.booking),
      fetch(urls. eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      
   
    .then(function([bookings, eventsCurrent,  eventsRepeat]){
      //console.log(bookings);
      //console.log(eventsCurrent);
      //console.log(eventsRepeat);
      thisBooking.parseData(bookings, eventsCurrent ,eventsRepeat);
    });
  }

  parseData(bookings, eventsCurrent , eventsRepeat){
    const thisBooking = this;

    thisBooking.booked = {};

    for(let item of bookings){
      thisBooking.makeBooked(item.date, item.hour, item.duration , item.table);
    }

    for(let item of eventsCurrent){
      thisBooking.makeBooked(item.date, item.hour, item.duration , item.table);
    }

    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;

    for(let item of eventsRepeat){
      if(item.repeat == 'daily'){
        for(let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)){
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration , item.table);
        }
      }
    }
    //console.log('thisBooking'.booked, thisBooking.booked);

    thisBooking.updateDOM();
  }

  makeBooked(date, hour ,duration, table){
    const thisBooking = this;

    if(typeof thisBooking.booked[date] == 'undefined'){
      thisBooking.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);

    for(let hourBlock = startHour; hourBlock < startHour + duration; hourBlock++){
      //console.log('loop', hourBlock);
      if(typeof thisBooking.booked[date][hourBlock] == 'undefined'){
        thisBooking.booked[date][hourBlock] = [];
      }
  
      thisBooking.booked[date][hourBlock].push(table);
    }
  }

  updateDOM(){
    const thisBooking = this;

    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

    let allAvailable = false;

    if(
      typeof thisBooking.booked[thisBooking.date] == 'undefined'
      ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
    ){
      allAvailable = true;
    }

    for ( let table of thisBooking.dom.tables ) {
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if (!isNaN(tableId)) {
        tableId = parseInt(tableId);
      }

      if (
        !allAvailable
        &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
      ){
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }
    }
  }

 
  
  
  render(wrapper) {
    const thisBooking = this;
    const genetratedHTML = templates.bookingWidget();

    thisBooking.dom = {};

    thisBooking.dom.wrapper = wrapper;

    thisBooking.dom.wrapper.innerHTML = genetratedHTML;

    thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);

    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);

    thisBooking.dom.tables =  thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
    thisBooking.dom.tablesAll = thisBooking.dom.wrapper.querySelector(select.booking.tablesAll);
    thisBooking.dom.form = thisBooking.dom.wrapper.querySelector(select.booking.form);
    thisBooking.dom.phone = thisBooking.dom.wrapper.querySelector(select.booking.phone);
    thisBooking.dom.address = thisBooking.dom.wrapper.querySelector(select.booking.address);
    thisBooking.dom.starters = thisBooking.dom.wrapper.querySelectorAll(select.booking.starter);

  }
  initWidgets() {
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);

    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

    thisBooking.dom.wrapper.addEventListener('update', function(){
      thisBooking.updateDOM();
    });
  }
  
  initTable(){
    const thisBooking = this;

    thisBooking.dom.tablesAll.addEventListener('click', function (event) {
      event.preventDefault();

      const clicked = event.target;

      thisBooking.tableId = clicked.getAttribute(settings.booking.tableIdAttribute);
      thisBooking.tableSelected = parseInt(thisBooking.tableId);

      if(!clicked.classList.contains(classNames.booking.tableBooked) && !clicked.classNames.contains(classNames.booking.tableSelected)) {
        thisBooking.removeTable();
        clicked.classList.add(classNames.booking.tableSelected);
        thisBooking.tableNumber = thisBooking.tableSelected;

      } else if (!clicked.classList.contains(classNames.booking.tableBooked) && !clicked.classNames.contains(classNames.booking.tableSelected)) {
        thisBooking.removeTable();

      } else if (!clicked.classList.contains(classNames.booking.tableBooked)) {
        alert('this table is already taken!');

      }
    });
  }

  removeTable(){
    const thisBooking = this;

    for(let table of thisBooking.dom.tables){
      if (table.classList.contains(classNames.booking.tableSelected))
        table.classList.remove(classNames.booking.tableSelected);
      thisBooking.tableNumber = null;
    }
  }

  sendOrder() {
    const thisBooking = this;
    const url = settings.db.url + '/' + settings.db.booking;

    const payload = {

      date: thisBooking.dom.datePicker.value,
      hour: thisBooking.dom.hourPicker.value,         
      table: thisBooking.tableNumber,
      duration: thisBooking.hoursAmount.correctValue,
      ppl: thisBooking.peopleAmountc.correctValue,
      starters:  [],
      phone: thisBooking.phone.value,
      address: thisBooking.address.value,
    };

    for (let starter of thisBooking.dom.starters) {
      if (starter.checked) {
        payload.starters.pushs(starter.value);
      }
    }
    

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch (url, options)
      .then(function (response) {
        return response.json();
      })
      .then(function(parsedResponse) {
        thisBooking.makeBooked(payload.date, payload.hour, payload.duration, payload.table);
        thisBooking.getData();
      });
    thisBooking.removeTables();
  }
}
  
export default Booking;


      