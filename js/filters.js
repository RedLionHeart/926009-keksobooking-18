'use strict';

(function () {
  var typeHousing = window.util.mapFilters.querySelector('#housing-type');

  // Проверка выбранного фильтра по типу жилья.
  var getTypeOfHouse = function (item) {
    if (typeHousing.value === 'any') {
      return true;
    } else {
      return item.offer.type === typeHousing.value;
    }
  };

  // Выборка пинов на основе фильтра.
  var mainFilter = function () {
    return window.defaultData
      .filter(function (item) {
        return getTypeOfHouse(item);
      })
      .slice(0, window.util.NUMBER_OF_OBJECTS);
  };

  // Обработчик изменения поля тип жилья, который удаляет старые пины, закрывает объявление и отрисовывает новые.
  var onHousingFilter = function () {
    var oldPins = window.util.pinsBlock.querySelectorAll('.map__pin:not(.map__pin--main)');

    window.map.closeAdPopup();
    window.form.deleteElements(oldPins);
    window.map.drawPins(mainFilter());
  };

  // Событие изменения типа жилья.
  typeHousing.addEventListener('change', onHousingFilter);

  window.filters = {
    mainFilter: mainFilter
  };
})();
