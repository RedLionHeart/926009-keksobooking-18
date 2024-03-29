'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var NUMBER_OF_OBJECTS = 5;

  var elementMap = document.querySelector('.map');
  var mapFilters = elementMap.querySelector('.map__filters-container');
  var pinsBlock = document.querySelector('.map__pins');
  var mainPin = pinsBlock.querySelector('.map__pin--main');
  var isActivePage = false;
  var mapErrorTemplate = document
    .querySelector('#error')
    .content.querySelector('.error');
  var errorTemplate = mapErrorTemplate.cloneNode(true);
  var buttonError = errorTemplate.querySelector('.error__button');
  var blockErrorMessage = errorTemplate.querySelector('.error__message');
  var successTemplate = document
    .querySelector('#success')
    .content.querySelector('.success');
  var successSendFormTemplate = successTemplate.cloneNode(true);
  var successMessage = successSendFormTemplate.querySelector('p');

  // Находим случайное целое число из заданного промежутка.
  var getRandomIntegerNumber = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  // Получаем массив случайной длины.
  var getRandomSubarray = function (array) {
    var startIndex = 0;
    var endIndex = getRandomIntegerNumber(startIndex, array.length);
    return array.slice(startIndex, endIndex);
  };

  // Получаем одно случайное значение из массива.
  var getRandomValueFromArray = function (array) {
    return array[getRandomIntegerNumber(0, array.length - 1)];
  };

  // Делаем соответствие чисел со словами.
  var uniteNumberWithWords = function (number, schedule) {
    var tens = number % 100;
    var units = number % 10;
    if (tens > 10 && tens < 20) {
      return schedule.OTHER;
    }
    if (units > 1 && units < 5) {
      return schedule.FEW;
    }
    if (units === 1) {
      return schedule.ONE;
    }
    return schedule.OTHER;
  };

  window.util = {
    ESC_KEYCODE: ESC_KEYCODE,
    ENTER_KEYCODE: ENTER_KEYCODE,
    NUMBER_OF_OBJECTS: NUMBER_OF_OBJECTS,
    isActivePage: isActivePage,
    elementMap: elementMap,
    mapFilters: mapFilters,
    mainPin: mainPin,
    pinsBlock: pinsBlock,
    mapErrorTemplate: mapErrorTemplate,
    blockErrorMessage: blockErrorMessage,
    buttonError: buttonError,
    errorTemplate: errorTemplate,
    successTemplate: successTemplate,
    successSendFormTemplate: successSendFormTemplate,
    successMessage: successMessage,
    getRandomIntegerNumber: getRandomIntegerNumber,
    getRandomSubarray: getRandomSubarray,
    getRandomValueFromArray: getRandomValueFromArray,
    uniteNumberWithWords: uniteNumberWithWords
  };
})();

