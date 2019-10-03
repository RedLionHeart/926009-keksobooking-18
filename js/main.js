'use strict';

var NUMBER_OF_OBJECTS = 8;
var OFFSET_X = 25;
var OFFSET_Y = 70;
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
var USER_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];
var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];
var TYPES_CORRELATION_MAP = {
  flat: 'Квартира',
  bungalo: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец'
};
var TRANSCRIPT_ROOMS = {
  one: ' комната для ',
  few: ' комнаты для ',
  other: ' комнат для '
};
var TRANSCRIPT_GUESTS = {
  one: ' гостя',
  few: ' гостей',
  other: ' гостей'
};

var elementMap = document.querySelector('.map');
var mapPinTemplate = document
  .querySelector('#pin')
  .content.querySelector('.map__pin');
var mapCardTemplate = document
  .querySelector('#card')
  .content.querySelector('.map__card');
var mapFilters = elementMap.querySelector('.map__filters-container');

// Находим случайное целое число из заданного промежутка.
var getRandomIntegerNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Создаем адрес изображения аватара автора объявления.
var generateAuthorAvatar = function (i) {
  return PATTERN_USER_LINK + USER_NUMBERS[i] + IMAGE_FORMAT;
};

// Получаем массив случайной длины.
var getRandomSubarray = function (array) {
  var startIndex = 0;
  var endIndex = getRandomIntegerNumber(startIndex, array.length);
  return array.slice(startIndex, endIndex);
};

// Получаем одно случайное значение из массива.
var getRandomValueFromArray = function (array) {
  return array[getRandomIntegerNumber(0, array.length - 1)];
};

// Получаем случайное время в заданном промежутке.
var getRandomTimeString = function () {
  return getRandomIntegerNumber(TIME_MIN, TIME_MAX) + ':00';
};

// Генерация данных объявления.
var makeArrayOfAdvertisments = function () {
  var advertismentsList = [];
  for (var i = 0; i < NUMBER_OF_OBJECTS; i++) {
    var locationX = getRandomIntegerNumber(0, elementMap.offsetWidth);
    var locationY = getRandomIntegerNumber(LOCATION_START_Y, LOCATION_END_Y);
    var advertismentItem = {
      author: {
        avatar: generateAuthorAvatar(i)
      },

      offer: {
        title: 'Заголовок ' + i,
        address: locationX + ', ' + locationY,
        price: getRandomIntegerNumber(PRICE_MIN_VALUE, PRICE_MAX_VALUE),
        type: getRandomValueFromArray(TYPES),
        rooms: getRandomIntegerNumber(NUMBER_OF_ROOMS_MIN, NUMBER_OF_ROOMS_MAX),
        guests: getRandomIntegerNumber(
            NUMBER_OF_GUESTS_MIN,
            NUMBER_OF_GUESTS_MAX
        ),
        checkin: getRandomTimeString(),
        checkout: getRandomTimeString(),
        features: getRandomSubarray(FEATURES),
        description: 'Описание ' + i,
        photos: getRandomSubarray(PHOTOS)
      },

      location: {
        x: locationX,
        y: locationY
      }
    };
    advertismentsList[i] = advertismentItem;
  }
  return advertismentsList;
};

// Показываем карту
var activeMap = function () {
  elementMap.classList.remove('map--faded');
};

// Генерируем метку объявления.
var generatePinBlock = function (pinData) {
  var templatePin = mapPinTemplate.cloneNode(true);
  var templatePinImage = templatePin.querySelector('img');
  templatePin.style.left = pinData.location.x - OFFSET_X + 'px';
  templatePin.style.top = pinData.location.y - OFFSET_Y + 'px';

  templatePinImage.src = pinData.author.avatar;
  templatePinImage.alt = pinData.offer.title;
  return templatePin;
};

// Добавляем метки в разметку.
var drawPins = function (data) {
  var pinsBlock = document.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < NUMBER_OF_OBJECTS; i++) {
    fragment.appendChild(generatePinBlock(data[i]));
  }
  pinsBlock.appendChild(fragment);
};

// Делаем соответствие чисел со словами.
var uniteNumberWithWords = function (number, schedule) {
  var tens = number % 100;
  var units = number % 10;
  if (tens > 10 && tens < 20) {
    return schedule.other;
  }
  if (units > 1 && units < 5) {
    return schedule.few;
  }
  if (units === 1) {
    return schedule.one;
  }
  return schedule.other;
};

// Добавляем доступные удобства в объявление.
var renderFeaturesInAd = function (dataItem, cardFeatures) {
  cardFeatures.innerHTML = '';
  for (var i = 0; i < dataItem.offer.features.length; i++) {
    var elementInCardFeatures = document.createElement('li');
    elementInCardFeatures.classList.add('popup__feature');
    elementInCardFeatures.classList.add('popup__feature--' + dataItem.offer.features[i]);
    cardFeatures.appendChild(elementInCardFeatures);
  }
};

// Добавляем фотографии в объявление.
var renderPhotosInAd = function (dataItem, cardPhotos) {
  var cardPhotoElement = cardPhotos.querySelector('.popup__photo');
  if (dataItem.offer.photos.length === 0) {
    cardPhotos.innerHTML = '';
  } else {
    for (var i = 0; i < dataItem.offer.photos.length; i++) {
      if (i === 0) {
        cardPhotoElement.src = dataItem.offer.photos[i];
      } else {
        var clonePhotoElement = cardPhotoElement.cloneNode(true);
        clonePhotoElement.src = dataItem.offer.photos[i];
        cardPhotos.appendChild(clonePhotoElement);
      }
    }
  }
};

// Создаем объявление на основе данных.
var generateCardBlock = function (dataCard) {
  var cardTemplate = mapCardTemplate.cloneNode(true);
  var cardFeatures = cardTemplate.querySelector('.popup__features');
  var cardPhotos = cardTemplate.querySelector('.popup__photos');
  var cardTitle = cardTemplate.querySelector('.popup__title');
  var cardAddress = cardTemplate.querySelector('.popup__text--address');
  var cardPrice = cardTemplate.querySelector('.popup__text--price');
  var cardType = cardTemplate.querySelector('.popup__type');
  var cardCapacity = cardTemplate.querySelector('.popup__text--capacity');
  var cardTime = cardTemplate.querySelector('.popup__text--time');
  var cardDescription = cardTemplate.querySelector('.popup__description');
  var cardAvatar = cardTemplate.querySelector('.popup__avatar');

  cardTitle.textContent = dataCard.offer.title;
  cardAddress.textContent = dataCard.offer.address;
  cardPrice.textContent = dataCard.offer.price + '₽/ночь';
  cardType.textContent = TYPES_CORRELATION_MAP[dataCard.offer.type];
  cardCapacity.textContent =
    dataCard.offer.rooms +
    uniteNumberWithWords(dataCard.offer.rooms, TRANSCRIPT_ROOMS) +
    dataCard.offer.guests +
    uniteNumberWithWords(dataCard.offer.guests, TRANSCRIPT_GUESTS);
  cardTime.textContent = 'Заезд после ' + dataCard.offer.checkin + ', выезд до ' + dataCard.offer.checkout;
  cardDescription.textContent = dataCard.offer.description;
  renderFeaturesInAd(dataCard, cardFeatures);
  renderPhotosInAd(dataCard, cardPhotos);
  cardAvatar.src = dataCard.author.avatar;
  return cardTemplate;
};

// Создаем объявление в разметке.
var createCard = function (dataCard) {
  elementMap.insertBefore(generateCardBlock(dataCard[0]), mapFilters);
};

// Запускаем функции.
var init = function () {
  activeMap();
  drawPins(makeArrayOfAdvertisments());
  createCard(makeArrayOfAdvertisments());
};

init();
