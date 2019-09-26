'use strict';

var NUMBER_OF_OBJECTS = 8;
var OFFSET_X = 25;
var OFFSET_Y = 70;
var ADRESS_X = 600;
var ADRESS_Y = 350;
var PRICE_MIN_VALUE = 100;
var PRICE_MAX_VALUE = 500;
var NUMBER_OF_ROOMS_MIN = 1;
var NUMBER_OF_ROOMS_MAX = 4;
var NUMBER_OF_GUESTS_MIN = 1;
var NUMBER_OF_GUESTS_MAX = 6;
var TIME_MIN = 12;
var TIME_MAX = 14;
var PATTERN_USER_LINK = 'img/avatars/user0';
var IMAGE_FORMAT = '.png';
var LOCATION_START_Y = 130;
var LOCATION_END_Y = 630;

var userNumbers = [1, 2, 3, 4, 5, 6, 7, 8];
var types = ['palace', 'flat', 'house', 'bungalo'];
var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var photos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var blockWidth = document.querySelector('.map').offsetWidth;
var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

var getRandomIntegerNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
var generateAuthorAvatar = function (i) {
  return PATTERN_USER_LINK + userNumbers[i] + IMAGE_FORMAT;
};
var createAvailableData = function (data) {
  var randomDataItems = getRandomIntegerNumber(1, data.length);
  var availableData = [];
  for (var i = 0; i < randomDataItems; i++) {
    availableData[i] = data[i];
  }
  return availableData;
};
var getRandomValueFromArray = function (array) {
  return array[getRandomIntegerNumber(0, array.length - 1)];
};

var makeArrayOfAdvertisments = function () {
  var advertismentsList = [];
  for (var i = 0; i < NUMBER_OF_OBJECTS; i++) {
    var advertismentItem = {
      'author': {
        'avatar': generateAuthorAvatar(i)
      },

      'offer': {
        'title': 'Заголовок ' + i,
        'address': ADRESS_X + ', ' + ADRESS_Y,
        'price': getRandomIntegerNumber(PRICE_MIN_VALUE, PRICE_MAX_VALUE),
        'type': getRandomValueFromArray(types),
        'rooms': getRandomIntegerNumber(NUMBER_OF_ROOMS_MIN, NUMBER_OF_ROOMS_MAX),
        'guests': getRandomIntegerNumber(NUMBER_OF_GUESTS_MIN, NUMBER_OF_GUESTS_MAX),
        'checkin': getRandomIntegerNumber(TIME_MIN, TIME_MAX) + ':00',
        'checkout': getRandomIntegerNumber(TIME_MIN, TIME_MAX) + ':00',
        'features': createAvailableData(features),
        'description': 'описание ' + i,
        'photos': createAvailableData(photos)
      },

      'location': {
        'x': getRandomIntegerNumber(0, blockWidth),
        'y': getRandomIntegerNumber(LOCATION_START_Y, LOCATION_END_Y)
      }
    };
    advertismentsList[i] = advertismentItem;
  }
  return advertismentsList;
};

var activeMap = function () {
  document.querySelector('.map').classList.remove('map--faded');
};
var getItemTemplatePin = function (data) {
  var templatePin = mapPinTemplate.cloneNode(true);
  templatePin.style.left = (data.location.x - OFFSET_X) + 'px';
  templatePin.style.top = (data.location.y - OFFSET_Y) + 'px';

  templatePin.querySelector('img').src = data.author.avatar;
  templatePin.querySelector('img').alt = data.offer.title;
  return templatePin;
};
var drawPins = function (mock) {
  var pinsBlock = document.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < NUMBER_OF_OBJECTS; i++) {
    var pin = getItemTemplatePin(mock[i]);
    fragment.appendChild(pin);
  }
  pinsBlock.appendChild(fragment);
};
var init = function () {
  activeMap();
  drawPins(makeArrayOfAdvertisments());
};

init();

