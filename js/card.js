'use strict';

(function () {
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

  var mapCardTemplate = document
    .querySelector('#card')
    .content.querySelector('.map__card');

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
      window.util.uniteNumberWithWords(dataCard.offer.rooms, TRANSCRIPT_ROOMS) +
      dataCard.offer.guests +
      window.util.uniteNumberWithWords(dataCard.offer.guests, TRANSCRIPT_GUESTS);
    cardTime.textContent = 'Заезд после ' + dataCard.offer.checkin + ', выезд до ' + dataCard.offer.checkout;
    cardDescription.textContent = dataCard.offer.description;
    window.data.renderFeaturesInAd(dataCard, cardFeatures);
    window.data.renderPhotosInAd(dataCard, cardPhotos);
    cardAvatar.src = dataCard.author.avatar;
    return cardTemplate;
  };

  window.card = {
    generateCardBlock: generateCardBlock
  };
})();
