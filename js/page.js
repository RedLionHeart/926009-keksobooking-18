'use strict';

(function () {
  var fieldElements = window.form.adForm.querySelectorAll('fieldset');
  var selectsOfMapFilters = window.util.mapFilters.querySelectorAll('select');

  // Функция блокировки элементов.
  var disableFields = function (collection) {
    for (var i = 0; i < collection.length; i++) {
      collection[i].setAttribute('disabled', 'disabled');
    }
  };

  // Функция разблокировки элементов.
  var enableFields = function (collection) {
    for (var i = 0; i < collection.length; i++) {
      collection[i].removeAttribute('disabled');
    }
  };

  // Управление видимостью карты.
  var setMapVisibility = function (isVisible) {
    if (isVisible) {
      window.util.elementMap.classList.remove('map--faded');
    } else {
      window.util.elementMap.classList.add('map--faded');
    }
  };

  // Управление изменением формы подачи объявления.
  var setAdFormDisabled = function (disabled) {
    if (disabled) {
      window.form.adForm.classList.remove('ad-form--disabled');
    } else {
      window.form.adForm.classList.add('ad-form--disabled');
    }
  };

  // Проверка на то, что страница активирована.
  var isActivatePage = function () {
    return !window.util.elementMap.classList.contains('map--faded');
  };

  // Обработчик активации страницы.
  var onMainPinClickHandler = function () {
    if (!isActivatePage()) {
      activatePage();
    }
  };

  var setStartCoords = function (X, Y) {
    var startCoords = {
      x: X,
      y: Y
    };
    return startCoords;
  };

  // Событие активации страницы при помощи левой кнопки мыши.
  window.util.mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var oldCoord = setStartCoords(evt.clientX, evt.clientY);
    onMainPinClickHandler();

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      window.form.getValueOfAddressInputField(
          window.util.mainPin.style.top,
          window.util.mainPin.style.left
      );

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove(evt, oldCoord));
    document.addEventListener('mouseup', onMouseUp);
  });

  var onMouseMove = function (moveEvt, oldCoord) {
    moveEvt.preventDefault();
    var shift = {
      x: oldCoord.x - moveEvt.clientX,
      y: oldCoord.y - moveEvt.clientY
    };
    oldCoord.x = moveEvt.clientX;
    oldCoord.y = moveEvt.clientY;

    var coordTopY = window.util.mainPin.offsetTop - shift.y;
    var calculateCoordYMin = window.data.LOCATION_START_Y -
      window.form.mainPinWidth -
      window.form.HEIGHT_OF_MAIN_PIN_POINT;
    var calculateCoordYMax = window.data.LOCATION_END_Y -
      window.form.mainPinHeight -
      window.form.HEIGHT_OF_MAIN_PIN_POINT;
    var coordLeftX = window.util.mainPin.offsetLeft - shift.x;
    var calculateCoordXMin = 0 - window.util.mainPin.offsetWidth / 2;
    var calculateCoordXMax = window.util.elementMap.offsetWidth - window.util.mainPin.offsetWidth / 2;
    if (coordTopY < calculateCoordYMin) {
      coordTopY = calculateCoordYMin;
    } else if (coordTopY > calculateCoordYMax) {
      coordTopY = calculateCoordYMax;
    }
    if (coordLeftX < calculateCoordXMin) {
      coordLeftX = calculateCoordXMin;
    } else if (
      coordLeftX > calculateCoordXMax
    ) {
      coordLeftX = calculateCoordXMax;
    }
    window.util.mainPin.style.top = coordTopY + 'px';
    window.util.mainPin.style.left = coordLeftX + 'px';
    window.form.getValueOfAddressInputField(
        window.util.mainPin.style.top,
        window.util.mainPin.style.left
    );
  };

  // Функция активации страницы.
  var activatePage = function () {
    window.map.drawPins(window.data.makeArrayOfAdvertisments());
    window.util.isActivePage = true;
    setMapVisibility(window.util.isActivePage);
    enableFields(fieldElements);
    enableFields(selectsOfMapFilters);
    setAdFormDisabled(window.util.isActivePage);
    window.form.addressInput.readOnly = true;
  };

  // Запускаем функции.
  (function () {
    window.form.checkRoomsAndCapacityValidity();
    window.form.setOptionsForRooms();
    disableFields(fieldElements);
    disableFields(selectsOfMapFilters);
    window.form.getValueOfAddressInputField();
    window.form.validateAdPrice();
  })();
})();
