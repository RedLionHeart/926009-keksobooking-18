'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var NUMBER_OF_OBJECTS = 8;

  var elementMap = document.querySelector('.map');
  var mapFilters = elementMap.querySelector('.map__filters-container');
  var mainPin = window.map.pinsBlock.querySelector('.map__pin--main');

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
      return schedule.other;
    }
    if (units > 1 && units < 5) {
      return schedule.few;
    }
    if (units === 1) {
      return schedule.one;
    }
    return schedule.other;
  };

  window.util = {
    ESC_KEYCODE: ESC_KEYCODE,
    NUMBER_OF_OBJECTS: NUMBER_OF_OBJECTS,
    elementMap: elementMap,
    mapFilters: mapFilters,
    mainPin: mainPin,
    getRandomIntegerNumber: getRandomIntegerNumber,
    getRandomSubarray: getRandomSubarray,
    getRandomValueFromArray: getRandomValueFromArray,
    uniteNumberWithWords: uniteNumberWithWords
  };
})();

