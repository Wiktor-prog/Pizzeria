
/* global Handlebars, dataSource */
const utils = {}; // eslint-disable-line no-unused-vars

utils.queryParams = function (params) {
  return Object.keys(params)
    .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');
};
  
utils.convertDataSourceToDbJson = function () {
  const productJson = [];
  for (let key in dataSource.products) {
    productJson.push(Object.assign({ id: key }, dataSource.products[key]));
  }
  
  console.log(JSON.stringify({ product: productJson, order: [] }, null, '  '));
};
  
utils.numberToHour = function (number) {
  return (
    (Math.floor(number) % 24) + ':' + ((number % 1) * 60 + '').padStart(2, '0')
  );
};
  
utils.hourToNumber = function (hour) {
  const parts = hour.split(':');
  
  return parseInt(parts[0]) + parseInt(parts[1]) / 60;
};
  
utils.dateToStr = function (dateObj) {
  return dateObj.toISOString().slice(0, 10);
};
  
utils.addDays = function (dateStr, days) {
  const dateObj = new Date(dateStr);
  dateObj.setDate(dateObj.getDate() + days);
  return dateObj;
};

Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper('joinValues', function(input, options) {
  return Object.values(input).join(options.fn(this));
});

export default utils;