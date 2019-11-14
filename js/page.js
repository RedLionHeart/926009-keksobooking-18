'use strict';

(function () {
  var LOCATION_START_Y = 130;
  var LOCATION_END_Y = 630;

  var fieldElements = window.form.adForm.querySelectorAll('fieldset');
  var selectsOfMapFilters = window.util.mapFilters.querySelectorAll('select');
  var startCoords = null;

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
  var onMainPinClick = function () {
    if (!isActivatePage()) {
      activatePage();
    }
  };

  // Функция вычисляет значение начальных координат.
  var getCoords = function (x, y) {
    return {
      x: x,
      y: y
    };
  };

  // Функция переопределяющая начальные координаты.
  var setStartCoords = function (x, y) {
    startCoords = getCoords(x, y);
  };

  // Функция ограничивающая перемещение главного пина.
  var compareValueCoord = function (coordDirection, coordMin, coordMax) {
    if (coordDirection < coordMin) {
      coordDirection = coordMin;
    } else if (coordDirection > coordMax) {
      coordDirection = coordMax;
    }
    return coordDirection;
  };

  // Событие передвижения мыши.
  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    var shift = getCoords(
        startCoords.x - moveEvt.clientX,
        startCoords.y - moveEvt.clientY
    );
    setStartCoords(moveEvt.clientX, moveEvt.clientY);

    var coordTopY = window.util.mainPin.offsetTop - shift.y;
    var calculateCoordYMin =
      LOCATION_START_Y -
      window.form.mainPinWidth -
      window.form.HEIGHT_OF_MAIN_PIN_POINT;
    var calculateCoordYMax =
      LOCATION_END_Y -
      window.form.mainPinHeight -
      window.form.HEIGHT_OF_MAIN_PIN_POINT;
    var coordLeftX = window.util.mainPin.offsetLeft - shift.x;
    var calculateCoordXMin = 0 - window.util.mainPin.offsetWidth / 2;
    var calculateCoordXMax =
      window.util.elementMap.offsetWidth - window.util.mainPin.offsetWidth / 2;

    window.util.mainPin.style.top =
      compareValueCoord(coordTopY, calculateCoordYMin, calculateCoordYMax) +
      'px';
    window.util.mainPin.style.left =
      compareValueCoord(coordLeftX, calculateCoordXMin, calculateCoordXMax) +
      'px';
    window.form.getValueOfAddressInputField(
        window.util.mainPin.style.top,
        window.util.mainPin.style.left
    );
  };

  // Событие отпускания кнопки мыши.
  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();
    window.form.getValueOfAddressInputField(
        window.util.mainPin.style.top,
        window.util.mainPin.style.left
    );

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  // Событие активации страницы при нажатии на кнопку мыши.
  window.util.mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    setStartCoords(evt.clientX, evt.clientY);
    onMainPinClick();

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  // Событие активации страницы при нажатии на enter.
  window.util.mainPin.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.util.ENTER_KEYCODE) {
      evt.preventDefault();
      activatePage();
    }
  });

  // Функция активации страницы.
  var activatePage = function () {
    window.map.loadPins();
    window.util.isActivePage = true;
    setMapVisibility(window.util.isActivePage);
    enableFields(fieldElements);
    enableFields(selectsOfMapFilters);
    setAdFormDisabled(window.util.isActivePage);
    window.form.addressInput.readOnly = true;
    window.form.checkRoomsAndCapacityValidity();
    window.form.getValueOfAddressInputField(
        window.util.mainPin.style.top,
        window.util.mainPin.style.left
    );
  };

  // Функция деактивации страницы
  var deactivatePage = function () {
    disableFields(fieldElements);
    disableFields(selectsOfMapFilters);
    window.util.isActivePage = false;
    setMapVisibility(window.util.isActivePage);
    setAdFormDisabled(window.util.isActivePage);
    window.form.getValueOfAddressInputField();
    window.util.mainPin.style.top = window.form.mainPinCoordTop + 'px';
    window.util.mainPin.style.left = window.form.mainPinCoordLeft + 'px';
    window.map.closeAdPopup();
    window.form.resetImages();
    window.filters.mapFilter.reset();
  };

  // Запускаем функции.
  var initPage = function () {
    window.form.checkRoomsAndCapacityValidity();
    window.form.setOptionsForRooms();
    disableFields(fieldElements);
    disableFields(selectsOfMapFilters);
    window.form.getValueOfAddressInputField();
    window.form.validateAdPrice();
  };

  initPage();

  window.page = {
    activatePage: activatePage,
    deactivatePage: deactivatePage
  };
})();
