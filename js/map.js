'use strict';

(function () {
  var mainBlock = document.querySelector('main');

  // Создаем объявление в разметке.
  var createCard = function (dataCard) {
    window.util.elementMap.insertBefore(dataCard, window.util.mapFilters);
  };

  // Функция успешной загрузки.
  var drawPins = function (data) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < data.length; i++) {
      if (data[i].offer !== undefined) {
        fragment.appendChild(window.pin.generatePinBlock(data[i], i));
      }
    }
    window.util.pinsBlock.appendChild(fragment);
    if (mainBlock.contains(window.util.errorTemplate)) {
      mainBlock.removeChild(window.util.errorTemplate);
    }
  };

  // Обработчик ошибочной загрузки.
  var errorHandler = function (errorMessage) {
    window.util.blockErrorMessage.textContent = errorMessage;
    mainBlock.insertAdjacentElement('afterbegin', window.util.errorTemplate);
    window.util.buttonError.addEventListener('click', function () {
      loadPins();
    });
  };

  // Запускаем функцию загрузки пинов.
  var loadPins = function () {
    window.backend.getKeksobookingData(function (data) {
      window.defaultData = data;
      drawPins(window.filters.filterPins());
    }, errorHandler);
  };

  // Функция удаления объявления из разметки.
  var closeAdPopup = function () {
    var adPopup = window.util.elementMap.querySelector('.map__card');
    var pinsWithoutMain = window.util.pinsBlock.querySelectorAll('.map__pin:not(.map__pin--main)');
    if (window.util.elementMap.contains(adPopup)) {
      window.util.elementMap.removeChild(adPopup);
    }
    pinsWithoutMain.forEach(function (element) {
      element.classList.remove('map__pin--active');
    });
  };

  // Событие открытия объявления по клику.
  window.util.pinsBlock.addEventListener('click', function (evt) {
    var targetPin = evt.target.closest('.map__pin:not(.map__pin--main)');
    if (targetPin) {
      closeAdPopup();
      var currentData = evt.target.closest('.map__pin').querySelector('img').alt;
      targetPin.classList.add('map__pin--active');
      createCard(window.card.generateCardBlock(window.defaultData.find(function (element) {
        return element.offer.title === currentData;
      })));
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
    mainBlock: mainBlock,
    drawPins: drawPins,
    loadPins: loadPins,
    closeAdPopup: closeAdPopup
  };
})();
