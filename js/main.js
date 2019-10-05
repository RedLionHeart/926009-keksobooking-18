'use strict';

var ENTER_KEYCODE = 13;
var HEIGHT_OF_MAIN_PIN_POINT = 16;
var NUMBER_OF_OBJECTS = 8;
var OFFSET_X = 25;
var OFFSET_Y = 70;
var PRICE_MIN_VALUE = 100;
var PRICE_MAX_VALUE = 500;
var NUMBER_OF_ROOMS_MIN = 1;
var NUMBER_OF_ROOMS_MAX = 4;
var NUMBER_OF_GUESTS_MIN = 1;
var NUMBER_OF_GUESTS_MAX = 6;
var TIME_MIN = 12;
var TIME_MAX = 14;
var PATTERN_USER_LINK = 'img/avatars/user0';
var IMAGE_FORMAT = '.png';
var LOCATION_START_Y = 130;
var LOCATION_END_Y = 630;
var USER_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];
var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];
var EXCEPTION_RATIO_ROOMS_AND_CAPACITY = {
  '1': ['3', '2', '0'],
  '2': ['3', '0'],
  '3': ['0'],
  '100': ['3', '2', '1']
};

var elementMap = document.querySelector('.map');
var mapPinTemplate = document
  .querySelector('#pin')
  .content.querySelector('.map__pin');
var mapFilters = elementMap.querySelector('.map__filters-container');
var pinsBlock = document.querySelector('.map__pins');
var mainPin = pinsBlock.querySelector('.map__pin--main');
var mainPinCoordLeft = parseFloat(mainPin.style.left);
var mainPinCoordTop = parseFloat(mainPin.style.top);
var mainPinWidth = mainPin.offsetWidth;
var mainPinHeight = mainPin.offsetHeight;
var isActivePage = false;
var adForm = document.querySelector('.ad-form');
var fieldElements = adForm.querySelectorAll('fieldset');
var selectsOfMapFilters = mapFilters.querySelectorAll('select');
var addressInput = adForm.querySelector('#address');
var selectRooms = adForm.querySelector('#room_number');
var selectCapacity = adForm.querySelector('#capacity');
var optionsCapacity = selectCapacity.querySelectorAll('option');

// Находим случайное целое число из заданного промежутка.
var getRandomIntegerNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Создаем адрес изображения аватара автора объявления.
var generateAuthorAvatar = function (i) {
  return PATTERN_USER_LINK + USER_NUMBERS[i] + IMAGE_FORMAT;
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

// Получаем случайное время в заданном промежутке.
var getRandomTimeString = function () {
  return getRandomIntegerNumber(TIME_MIN, TIME_MAX) + ':00';
};

// Генерация данных объявления.
var makeArrayOfAdvertisments = function () {
  var advertismentsList = [];
  for (var i = 0; i < NUMBER_OF_OBJECTS; i++) {
    var locationX = getRandomIntegerNumber(0, elementMap.offsetWidth);
    var locationY = getRandomIntegerNumber(LOCATION_START_Y, LOCATION_END_Y);
    var advertismentItem = {
      author: {
        avatar: generateAuthorAvatar(i)
      },

      offer: {
        title: 'Заголовок ' + i,
        address: locationX + ', ' + locationY,
        price: getRandomIntegerNumber(PRICE_MIN_VALUE, PRICE_MAX_VALUE),
        type: getRandomValueFromArray(TYPES),
        rooms: getRandomIntegerNumber(NUMBER_OF_ROOMS_MIN, NUMBER_OF_ROOMS_MAX),
        guests: getRandomIntegerNumber(
            NUMBER_OF_GUESTS_MIN,
            NUMBER_OF_GUESTS_MAX
        ),
        checkin: getRandomTimeString(),
        checkout: getRandomTimeString(),
        features: getRandomSubarray(FEATURES),
        description: 'Описание ' + i,
        photos: getRandomSubarray(PHOTOS)
      },

      location: {
        x: locationX,
        y: locationY
      }
    };
    advertismentsList[i] = advertismentItem;
  }
  return advertismentsList;
};

// Генерируем метку объявления.
var generatePinBlock = function (pinData) {
  var templatePin = mapPinTemplate.cloneNode(true);
  var templatePinImage = templatePin.querySelector('img');
  templatePin.style.left = pinData.location.x - OFFSET_X + 'px';
  templatePin.style.top = pinData.location.y - OFFSET_Y + 'px';

  templatePinImage.src = pinData.author.avatar;
  templatePinImage.alt = pinData.offer.title;
  return templatePin;
};

// Добавляем метки в разметку.
var drawPins = function (data) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < NUMBER_OF_OBJECTS; i++) {
    fragment.appendChild(generatePinBlock(data[i]));
  }
  pinsBlock.appendChild(fragment);
};

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

// Функция активации страницы.
var activatePage = function () {
  if (!isActivePage) {
    drawPins(makeArrayOfAdvertisments());
  }
  isActivePage = true;
  elementMap.classList.remove('map--faded');
  enableFields(fieldElements);
  enableFields(selectsOfMapFilters);
  adForm.classList.remove('ad-form--disabled');
  addressInput.readOnly = true;
};

// Функция вычисления значения метки для поля ввода адреса.
var getValueOfAddressInputField = function () {
  var calculateCoordX = Math.floor(mainPinCoordLeft + mainPinWidth / 2);
  var calculateUnactiveCoordY = Math.floor(mainPinCoordTop + mainPinHeight / 2);
  var calculateActiveCoordY = Math.floor(mainPinCoordTop + mainPinHeight + HEIGHT_OF_MAIN_PIN_POINT);

  if (isActivePage) {
    addressInput.value = calculateCoordX + ', ' + calculateActiveCoordY;
  } else {
    addressInput.value = calculateCoordX + ', ' + calculateUnactiveCoordY;
  }
};

// Событие активации страницы при помощи левой кнопки мыши.
mainPin.addEventListener('mousedown', function () {
  activatePage();
  getValueOfAddressInputField();
});

// Событие активации страницы при помощи клавиши enter.
mainPin.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    activatePage();
    getValueOfAddressInputField();
  }
});

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

// Запускаем функции.
var init = function () {
  checkRoomsAndCapacityValidity();
  setOptionsForRooms();
  disableFields(fieldElements);
  disableFields(selectsOfMapFilters);
  getValueOfAddressInputField();
};

init();
