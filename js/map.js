'use strict';

(function () {


  // Добавляем метки в разметку.
  var drawPins = function (data) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < window.util.NUMBER_OF_OBJECTS; i++) {
      fragment.appendChild(window.pin.generatePinBlock(data[i], i));
    }
    window.util.pinsBlock.appendChild(fragment);
  };

  // Создаем объявление в разметке.
  var createCard = function (dataCard) {
    window.util.elementMap.insertBefore(dataCard, window.util.mapFilters);
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
    drawPins: drawPins
  };
})();
