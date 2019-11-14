'use strict';

(function () {
  var DEFAULT_PREVIEW = 'img/muffin-grey.svg';
  var HEIGHT_OF_MAIN_PIN_POINT = 16;
  var ExceptionRatioRoomsAndCapacity = {
    '1': ['3', '2', '0'],
    '2': ['3', '0'],
    '3': ['0'],
    '100': ['3', '2', '1']
  };
  var MatchingTypeWithMinPrice = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };
  var adForm = document.querySelector('.ad-form');
  var buttonReset = adForm.querySelector('.ad-form__reset');
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
  var previewHeader = adForm.querySelector('.ad-form-header__preview img');
  var previewPhoto = adForm.querySelector('.ad-form__photo');
  var fileChooserAvatar = adForm.querySelector('#avatar');
  var fileChooserPhoto = adForm.querySelector('#images');


  // Функция вычисления значения метки для поля ввода адреса.
  var getValueOfAddressInputField = function (coordY, coordX) {
    var calculateCoordX = Math.floor(mainPinCoordLeft + mainPinWidth / 2);
    var calculateUnactiveCoordY = Math.floor(mainPinCoordTop + mainPinHeight / 2);
    var calculateActiveCoordY = Math.floor(parseFloat(coordY) + mainPinHeight + HEIGHT_OF_MAIN_PIN_POINT);
    var calculateActiveCoordX = Math.floor(parseFloat(coordX) + mainPinWidth / 2);

    if (window.util.isActivePage) {
      addressInput.value = calculateActiveCoordX + ', ' + calculateActiveCoordY;
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
      optionCapacityOption.disabled = ExceptionRatioRoomsAndCapacity[roomNumber].includes(optionCapacityValue);
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
    priceInputAd.min = MatchingTypeWithMinPrice[typeInputAd.value];
    priceInputAd.placeholder = MatchingTypeWithMinPrice[typeInputAd.value];
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

  // Событие изменения аватарки автора объявления.
  fileChooserAvatar.addEventListener('change', function () {
    window.image.addPicture(fileChooserAvatar, previewHeader, false);
  });

  // Событие изменения фотографии жилья объявления.
  fileChooserPhoto.addEventListener('change', function () {
    window.image.addPicture(fileChooserPhoto, previewPhoto, true);
  });

  // Функция сброса картинок в начальное положение.
  var resetImages = function () {
    previewHeader.src = DEFAULT_PREVIEW;
    window.image.removePicture(previewPhoto);
  };

  // Функция удаления элементов
  var deleteElements = function (collection) {
    for (var i = 0; i < collection.length; i++) {
      collection[i].remove();
    }
  };

  // Функция удаления соответствующего сообщения
  var generateMessage = function (template, message, isLoadError) {
    // Функция срабатывающая при ошибке загрузки пинов, которая возвращает главный пин на место.
    var returnMainPinInDefault = function () {
      if (isLoadError) {
        window.util.mainPin.style.top = window.form.mainPinCoordTop + 'px';
        window.util.mainPin.style.left = window.form.mainPinCoordLeft + 'px';
      }
    };

    // Событие закрытия сообщения успешной отправки формы клавишей esc
    var onEscPress = function (evt) {
      if (evt.keyCode === window.util.ESC_KEYCODE && window.map.mainBlock.contains(template)) {
        window.map.mainBlock.removeChild(template);
        returnMainPinInDefault();
        document.removeEventListener('keydown', onEscPress);
      }
    };

    // Событие закрытия сообщения успешной отправки формы путем клика вне области сообщения.
    var onClickOverArea = function (evt) {
      if (evt.target !== message && window.map.mainBlock.contains(template)) {
        window.map.mainBlock.removeChild(template);
        document.removeEventListener('keydown', onEscPress);
        returnMainPinInDefault();
      }
    };

    if (template.contains(window.util.buttonError)) {
      window.util.buttonError.addEventListener('click', function () {
        if (window.map.mainBlock.contains(template)) {
          window.map.mainBlock.removeChild(template);
          returnMainPinInDefault();
          document.removeEventListener('keydown', onEscPress);
        }
      });
    }

    document.addEventListener('keydown', onEscPress);
    template.addEventListener('click', onClickOverArea);
  };

  // Событие успешной отправки формы
  var onSuccess = function () {
    var mapPinsWithoutMainPin = window.util.pinsBlock.querySelectorAll('.map__pin:not(.map__pin--main)');

    adForm.reset();
    deleteElements(mapPinsWithoutMainPin);
    window.page.deactivatePage();
    window.map.mainBlock.insertAdjacentElement('afterbegin', window.util.successSendFormTemplate);
    generateMessage(window.util.successSendFormTemplate, window.util.successMessage);
  };

  // Событие отправки формы с ошибками
  var onError = function (errorMessage) {
    window.util.blockErrorMessage.textContent = errorMessage;
    window.map.mainBlock.insertAdjacentElement('afterbegin', window.util.errorTemplate);
    generateMessage(window.util.errorTemplate, window.util.blockErrorMessage);
  };

  // Событие отправки данных на сервер
  adForm.addEventListener('submit', function (evt) {
    window.backend.sendKeksobookingData(new FormData(adForm), onSuccess, onError);
    evt.preventDefault();
  });

  // Событие срабатывающее на кнопку очистить
  buttonReset.addEventListener('click', function () {
    var mapPinsWithoutMainPin = window.util.pinsBlock.querySelectorAll('.map__pin:not(.map__pin--main)');

    adForm.reset();
    deleteElements(mapPinsWithoutMainPin);
    window.page.deactivatePage();
  });

  window.form = {
    mainPinCoordTop: mainPinCoordTop,
    mainPinCoordLeft: mainPinCoordLeft,
    getValueOfAddressInputField: getValueOfAddressInputField,
    addressInput: addressInput,
    adForm: adForm,
    mainPinWidth: mainPinWidth,
    mainPinHeight: mainPinHeight,
    HEIGHT_OF_MAIN_PIN_POINT: HEIGHT_OF_MAIN_PIN_POINT,
    checkRoomsAndCapacityValidity: checkRoomsAndCapacityValidity,
    setOptionsForRooms: setOptionsForRooms,
    validateAdPrice: validateAdPrice,
    deleteElements: deleteElements,
    resetImages: resetImages,
    generateMessage: generateMessage
  };
})();
