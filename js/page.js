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
    if (window.util.elementMap.classList.contains('map--faded')) {
      return false;
    }
    return true;
  };

  // Обработчик активации страницы.
  var onMainPinClickHandler = function () {
    if (!isActivatePage()) {
      activatePage();
      window.form.getValueOfAddressInputField();
    }
  };

  // Событие активации страницы при помощи левой кнопки мыши.
  window.util.mainPin.addEventListener('click', onMainPinClickHandler);

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
