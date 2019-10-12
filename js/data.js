'use strict';

(function () {
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

  // Создаем адрес изображения аватара автора объявления.
  var generateAuthorAvatar = function (i) {
    return PATTERN_USER_LINK + USER_NUMBERS[i] + IMAGE_FORMAT;
  };

  // Получаем случайное время в заданном промежутке.
  var getRandomTimeString = function () {
    return window.util.getRandomIntegerNumber(TIME_MIN, TIME_MAX) + ':00';
  };

  // Генерация данных объявления.
  var makeArrayOfAdvertisments = function () {
    var advertismentsList = [];
    for (var i = 0; i < window.util.NUMBER_OF_OBJECTS; i++) {
      var locationX = window.util.getRandomIntegerNumber(0, window.util.elementMap.offsetWidth);
      var locationY = window.util.getRandomIntegerNumber(LOCATION_START_Y, LOCATION_END_Y);
      var advertismentItem = {
        author: {
          avatar: generateAuthorAvatar(i)
        },

        offer: {
          title: 'Заголовок ' + i,
          address: locationX + ', ' + locationY,
          price: window.util.getRandomIntegerNumber(PRICE_MIN_VALUE, PRICE_MAX_VALUE),
          type: window.util.getRandomValueFromArray(TYPES),
          rooms: window.util.getRandomIntegerNumber(NUMBER_OF_ROOMS_MIN, NUMBER_OF_ROOMS_MAX),
          guests: window.util.getRandomIntegerNumber(
              NUMBER_OF_GUESTS_MIN,
              NUMBER_OF_GUESTS_MAX
          ),
          checkin: getRandomTimeString(),
          checkout: getRandomTimeString(),
          features: window.util.getRandomSubarray(FEATURES),
          description: 'Описание ' + i,
          photos: window.util.getRandomSubarray(PHOTOS)
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

  window.data = {
    makeArrayOfAdvertisments: makeArrayOfAdvertisments,
    renderFeaturesInAd: renderFeaturesInAd,
    renderPhotosInAd: renderPhotosInAd
  };
})();
