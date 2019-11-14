'use strict';

(function () {
  var HOUSING_PRICE_MIDDLE = 'middle';
  var HOUSING_PRICE_LOW = 'low';
  var HOUSING_PRICE_HIGH = 'high';
  var MIN_PRICE_HOUSING = 10000;
  var MAX_PRICE_HOUSING = 50000;
  var DEFAULT_VALUE_HOUSING = 'any';
  var MAX_VALUE_OF_GUESTS = 2;

  var mapFilter = document.querySelector('.map__filters');
  var typeHousing = window.util.mapFilters.querySelector('#housing-type');
  var priceHousing = window.util.mapFilters.querySelector('#housing-price');
  var roomsHousing = window.util.mapFilters.querySelector('#housing-rooms');
  var guestsHousing = window.util.mapFilters.querySelector('#housing-guests');
  var featuresHousing = window.util.mapFilters.querySelectorAll(
      '.map__checkbox'
  );

  // Проверка выбранного фильтра по типу жилья.
  var getTypeOfHouse = function (item) {
    if (typeHousing.value === DEFAULT_VALUE_HOUSING) {
      return true;
    }
    return item.offer.type === typeHousing.value;
  };

  // Проверка выбранного фильтра по стоимости.
  var getHousingPrice = function (item) {
    if (priceHousing.value === HOUSING_PRICE_MIDDLE) {
      return item.offer.price >= MIN_PRICE_HOUSING && item.offer.price <= MAX_PRICE_HOUSING;
    } else if (priceHousing.value === HOUSING_PRICE_LOW) {
      return item.offer.price < MIN_PRICE_HOUSING;
    } else if (priceHousing.value === HOUSING_PRICE_HIGH) {
      return item.offer.price > MAX_PRICE_HOUSING;
    }
    return true;
  };

  // Проверка выбранного фильтра по количеству комнат.
  var getHousingRooms = function (item) {
    if (roomsHousing.value === DEFAULT_VALUE_HOUSING) {
      return true;
    }
    return item.offer.rooms === parseInt(roomsHousing.value, 10);
  };

  // Проверка выбранного фильтра по количеству гостей.
  var getHousingGuests = function (item) {
    if (guestsHousing.value === DEFAULT_VALUE_HOUSING) {
      return true;
    } else if (parseInt(guestsHousing.value, 10) === 0) {
      return item.offer.guests > MAX_VALUE_OF_GUESTS;
    }
    return item.offer.guests === parseInt(guestsHousing.value, 10);
  };

  // Проверка выбранного фильтра по нажатию на кнопку удобства.
  var getHousingFeatures = function (item) {
    return Array.from(featuresHousing)
      .filter(function (element) {
        return element.checked;
      })
      .map(function (element) {
        return element.value;
      })
      .every(function (feature) {
        return item.offer.features.includes(feature);
      });
  };

  // Выборка пинов на основе фильтра.
  var filterPins = function () {
    return window.defaultData
      .filter(function (item) {
        return (
          getTypeOfHouse(item) &&
          getHousingPrice(item) &&
          getHousingRooms(item) &&
          getHousingGuests(item) &&
          getHousingFeatures(item)
        );
      })
      .slice(0, window.util.NUMBER_OF_OBJECTS);
  };

  // Обработчик изменения полей фильтра, который удаляет старые пины, закрывает объявление и отрисовывает новые.
  var onHousingFilter = window.debounce(function () {
    var oldPins = window.util.pinsBlock.querySelectorAll(
        '.map__pin:not(.map__pin--main)'
    );

    window.map.closeAdPopup();
    window.form.deleteElements(oldPins);
    window.map.drawPins(filterPins());
  });

  // Событие изменения полей фильтра.
  mapFilter.addEventListener('change', onHousingFilter);

  window.filters = {
    mapFilter: mapFilter,
    filterPins: filterPins
  };
})();
