'use strict';

(function () {
  var mapErrorTemplate = document
    .querySelector('#error')
    .content.querySelector('.error');
  var mainBlock = document.querySelector('main');

  // Создаем объявление в разметке.
  var createCard = function (dataCard) {
    window.util.elementMap.insertBefore(dataCard, window.util.mapFilters);
  };

  // Функция успешной загрузки.
  var drawPins = function (data) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < window.util.NUMBER_OF_OBJECTS; i++) {
      if (data[i].offer !== undefined) {
        fragment.appendChild(window.pin.generatePinBlock(data[i], i));
      }
    }
    window.util.pinsBlock.appendChild(fragment);
  };

  // Обработчик ошибочной загрузки.
  var errorHandler = function (errorMessage) {
    var errorTemplate = mapErrorTemplate.cloneNode(true);
    var blockErrorMessage = errorTemplate.querySelector('.error__message');

    blockErrorMessage.textContent = errorMessage;
    mainBlock.insertAdjacentElement('afterbegin', errorTemplate);
  };

  // Запускаем функцию загрузки пинов.
  var loadPins = function () {
    window.backend.load(drawPins, errorHandler, window.backend.API_PATHS);
  };

  // Функция удаления объявления из разметки.
  var closeAdPopup = function () {
    var adPopup = window.util.elementMap.querySelector('.map__card');
    if (window.util.elementMap.contains(adPopup)) {
      window.util.elementMap.removeChild(adPopup);
    }
  };

  // Событие открытия объявления по клику.
  window.util.pinsBlock.addEventListener('click', function (evt) {
    if (evt.target.closest('.map__pin:not(.map__pin--main)')) {
      closeAdPopup();
      var currentData = evt.target.closest('.map__pin').dataset.index;
      createCard(window.card.generateCardBlock(window.data.makeArrayOfAdvertisments()[currentData]));
    }
  });

  // Событие закрытия объявления по клику на крестик.
  document.addEventListener('click', function (evt) {
    if (evt.target.matches('.popup__close')) {
      closeAdPopup();
    }
  });

  // Событие закрытия объявления при нажатии на esc.
  document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.util.ESC_KEYCODE) {
      closeAdPopup();
    }
  });

  window.map = {
    loadPins: loadPins
  };
})();
