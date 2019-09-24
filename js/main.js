'use strict';

var COUNT = 8;
var COUNT_START = 1;
var ADRESS_X_MIN_VALUE = 100;
var ADRESS_X_MAX_VALUE = 1000;
var ADRESS_Y_MIN_VALUE = 100;
var ADRESS_Y_MAX_VALUE = 100;
var PRICE_MIN_VALUE = 100;
var PRICE_MAX_VALUE = 500;
var NUMBER_OF_ROOMS_MIN = 1;
var NUMBER_OF_ROOMS_MAX = 4;
var NUMBER_OF_GUESTS_MIN = 1;
var NUMBER_OF_GUESTS_MAX = 6;
var NUMBER_OF_PHOTO_MIN = 1;
var NUMBER_OF_PHOTO_MAX = 3;
var TIME_MIN = 12;
var TIME_MAX = 14;
var PATTERN_PHOTO_LINK = 'http://o0.github.io/assets/images/tokyo/hotel';
var LOCATION_START_Y = 130;
var LOCATION_END_Y = 630;

var types = ['palace', 'flat', 'house', 'bungalo'];
var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var blockWidth = document.querySelector('.map').offsetWidth;

var getRandomValue = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
var getFeatures = function (featuresData) {
  var randomFeatureItems = getRandomValue(1, features.length - 1);
  var availablefeatures = [];
  for (var i = 0; i < randomFeatureItems; i++) {
    availablefeatures[i] = featuresData[i];
  }
  return availablefeatures;
};
var getPhotoAdress = function () {
  var randomCountPhoto = getRandomValue(COUNT_START, COUNT);
  var photosList = [];
  for (var i = 0; i < randomCountPhoto; i++) {
    photosList[i] = PATTERN_PHOTO_LINK + getRandomValue(NUMBER_OF_PHOTO_MIN, NUMBER_OF_PHOTO_MAX) + '.jpg';
  }
  return photosList;
};

var makeArrayOfAdvertisments = function () {
  var advertismentsList = [];
  for (var i = 0; i <= COUNT; i++) {
    var advertismentItem = {
      'author': {
        'avatar': 'img/avatars/user0' + getRandomValue(1, COUNT) + '.png'
      },

      'offer': {
        'title': 'Заголовок ' + i,
        'address': getRandomValue(ADRESS_X_MIN_VALUE, ADRESS_X_MAX_VALUE) + ', ' + getRandomValue(ADRESS_Y_MIN_VALUE, ADRESS_Y_MAX_VALUE),
        'price': getRandomValue(PRICE_MIN_VALUE, PRICE_MAX_VALUE),
        'type': types[getRandomValue(0, types.length - 1)],
        'rooms': getRandomValue(NUMBER_OF_ROOMS_MIN, NUMBER_OF_ROOMS_MAX),
        'guests': getRandomValue(NUMBER_OF_GUESTS_MIN, NUMBER_OF_GUESTS_MAX),
        'checkin': getRandomValue(TIME_MIN, TIME_MAX) + ':00',
        'checkout': getRandomValue(TIME_MIN, TIME_MAX) + ':00',
        'features': getFeatures(features),
        'description': 'описание ' + i,
        'photos': getPhotoAdress()
      },

      'location': {
        'x': getRandomValue(0, blockWidth),
        'y': getRandomValue(LOCATION_START_Y, LOCATION_END_Y)
      }
    };
    advertismentsList[i] = advertismentItem;
  }
  return advertismentsList;
};

var activeMap = function () {
  document.querySelector('.map').classList.remove('map--faded');
};
var fillTemplatePin = function (data) {
  var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var template = mapPinTemplate.cloneNode(true);
  template.style.left = data.location.x + 'px';
  template.style.top = data.location.y + 'px';

  template.querySelector('img').src = data.author.avatar;
  template.querySelector('img').alt = data.offer.title;
  return template;
};
var drawPins = function (mock) {
  var pinsBlock = document.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();
  for (var i = 0; i <= COUNT; i++) {
    var pin = fillTemplatePin(mock[i]);
    fragment.appendChild(pin);
  }
  pinsBlock.appendChild(fragment);
};

var mockData = makeArrayOfAdvertisments();
activeMap();
drawPins(mockData);
