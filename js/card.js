'use strict';

(function () {
  var AccomodationType = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец'
  };
  var TranscriptRooms = {
    one: ' комната для ',
    few: ' комнаты для ',
    other: ' комнат для '
  };
  var TranscriptGuests = {
    one: ' гостя',
    few: ' гостей',
    other: ' гостей'
  };

  var mapCardTemplate = document
    .querySelector('#card')
    .content.querySelector('.map__card');

  // Проверка на пустоту приходящих данных.
  var checkEmpty = function (dataAdItem, cardItem, render, dataCard) {
    if (dataAdItem.length === 0) {
      cardItem.style = 'display:none;';
    } else {
      render(dataCard, cardItem);
    }
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
    cardType.textContent = AccomodationType[dataCard.offer.type];
    cardCapacity.textContent =
      dataCard.offer.rooms +
      window.util.uniteNumberWithWords(dataCard.offer.rooms, TranscriptRooms) +
      dataCard.offer.guests +
      window.util.uniteNumberWithWords(dataCard.offer.guests, TranscriptGuests);
    cardTime.textContent = 'Заезд после ' + dataCard.offer.checkin + ', выезд до ' + dataCard.offer.checkout;
    cardDescription.textContent = dataCard.offer.description;
    checkEmpty(dataCard.offer.features, cardFeatures, renderFeaturesInAd, dataCard);
    checkEmpty(dataCard.offer.photos, cardPhotos, renderPhotosInAd, dataCard);
    cardAvatar.src = dataCard.author.avatar;
    return cardTemplate;
  };

  window.card = {
    generateCardBlock: generateCardBlock
  };
})();
