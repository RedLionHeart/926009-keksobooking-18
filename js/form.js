'use strict';

(function () {
  var HEIGHT_OF_MAIN_PIN_POINT = 16;
  var EXCEPTION_RATIO_ROOMS_AND_CAPACITY = {
    '1': ['3', '2', '0'],
    '2': ['3', '0'],
    '3': ['0'],
    '100': ['3', '2', '1']
  };
  var MATCHING_TYPE_WITH_MIN_PRICE = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };
  var adForm = document.querySelector('.ad-form');
  var mainPinCoordLeft = parseFloat(window.util.mainPin.style.left);
  var mainPinCoordTop = parseFloat(window.util.mainPin.style.top);
  var mainPinWidth = window.util.mainPin.offsetWidth;
  var mainPinHeight = window.util.mainPin.offsetHeight;
  var addressInput = adForm.querySelector('#address');
  var selectRooms = adForm.querySelector('#room_number');
  var selectCapacity = adForm.querySelector('#capacity');
  var optionsCapacity = selectCapacity.querySelectorAll('option');
  var priceInputAd = adForm.querySelector('#price');
  var typeInputAd = adForm.querySelector('#type');
  var timeinSelectAdForm = adForm.querySelector('#timein');
  var timeoutSelectAdForm = adForm.querySelector('#timeout');

  // Функция вычисления значения метки для поля ввода адреса.
  var getValueOfAddressInputField = function () {
    var calculateCoordX = Math.floor(mainPinCoordLeft + mainPinWidth / 2);
    var calculateUnactiveCoordY = Math.floor(mainPinCoordTop + mainPinHeight / 2);
    var calculateActiveCoordY = Math.floor(mainPinCoordTop + mainPinHeight + HEIGHT_OF_MAIN_PIN_POINT);

    if (window.util.isActivePage) {
      addressInput.value = calculateCoordX + ', ' + calculateActiveCoordY;
    } else {
      addressInput.value = calculateCoordX + ', ' + calculateUnactiveCoordY;
    }
  };

  // Функция валидации количества мест и количества комнат.
  var checkRoomsAndCapacityValidity = function () {
    if (selectRooms.value === '100' && selectCapacity.value !== '0') {
      selectCapacity.setCustomValidity('Необходимо выбрать не для гостей');
    } else if (selectCapacity.value === '0' && selectRooms.value !== '100') {
      selectRooms.setCustomValidity('Для выбора данного количества мест нужно выбрать 100 комнат');
    } else if (selectRooms.value < selectCapacity.value && selectCapacity.value !== 0) {
      selectRooms.setCustomValidity('Количество мест больше, чем комнат. Выберете большее количество комнат');
    } else {
      selectRooms.setCustomValidity('');
      selectCapacity.setCustomValidity('');
    }
  };

  // Функцию деактивирующая несоответствующие поля в списке мест.
  var setOptionsForRooms = function () {
    var roomNumber = selectRooms.value;
    var optionCapacityOption = null;
    var optionCapacityValue = null;

    for (var i = 0; i < optionsCapacity.length; i++) {
      optionCapacityOption = optionsCapacity[i];
      optionCapacityValue = optionCapacityOption.value;
      optionCapacityOption.disabled = EXCEPTION_RATIO_ROOMS_AND_CAPACITY[roomNumber].includes(optionCapacityValue);
    }
  };

  // Обработчик проверки соответствия комнат.
  selectRooms.addEventListener('input', function () {
    checkRoomsAndCapacityValidity();
    setOptionsForRooms();
  });

  // Обработчик проверки соответствия мест.
  selectCapacity.addEventListener('input', function () {
    checkRoomsAndCapacityValidity();
  });

  // Соответствие типа жилья с ценой.
  var validateAdPrice = function () {
    priceInputAd.min = MATCHING_TYPE_WITH_MIN_PRICE[typeInputAd.value];
    priceInputAd.placeholder = MATCHING_TYPE_WITH_MIN_PRICE[typeInputAd.value];
  };

  // Событие проверки соответствия типа жилья с ценой за ночь.
  typeInputAd.addEventListener('input', function () {
    validateAdPrice();
  });

  // Синхронизация заезда и выезда.
  timeoutSelectAdForm.addEventListener('change', function () {
    timeinSelectAdForm.value = timeoutSelectAdForm.value;
  });

  // Синхронизация заезда и выезда.
  timeinSelectAdForm.addEventListener('change', function () {
    timeoutSelectAdForm.value = timeinSelectAdForm.value;
  });

  window.form = {
    getValueOfAddressInputField: getValueOfAddressInputField,
    addressInput: addressInput,
    adForm: adForm,
    checkRoomsAndCapacityValidity: checkRoomsAndCapacityValidity,
    setOptionsForRooms: setOptionsForRooms,
    validateAdPrice: validateAdPrice
  };
})();
