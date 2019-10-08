'use strict';

var ESC_KEYCODE = 27;
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
var MATCHING_TYPE_WITH_MIN_PRICE = {
  bungalo: 0,
  flat: 1000,
  house: 5000,
  palace: 10000
};
var TYPES_CORRELATION_MAP = {
  flat: 'Квартира',
  bungalo: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец'
};
var TRANSCRIPT_ROOMS = {
  one: ' комната для ',
  few: ' комнаты для ',
  other: ' комнат для '
};
var TRANSCRIPT_GUESTS = {
  one: ' гостя',
  few: ' гостей',
  other: ' гостей'
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
var priceInputAd = adForm.querySelector('#price');
var typeInputAd = adForm.querySelector('#type');
var timeinSelectAdForm = adForm.querySelector('#timein');
var timeoutSelectAdForm = adForm.querySelector('#timeout');
var mapCardTemplate = document
  .querySelector('#card')
  .content.querySelector('.map__card');

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
var generatePinBlock = function (pinData, index) {
  var templatePin = mapPinTemplate.cloneNode(true);
  var templatePinImage = templatePin.querySelector('img');
  templatePin.style.left = pinData.location.x - OFFSET_X + 'px';
  templatePin.style.top = pinData.location.y - OFFSET_Y + 'px';

  templatePinImage.src = pinData.author.avatar;
  templatePinImage.alt = pinData.offer.title;
  templatePin.dataset.index = index;
  return templatePin;
};

// Добавляем метки в разметку.
var drawPins = function (data) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < NUMBER_OF_OBJECTS; i++) {
    fragment.appendChild(generatePinBlock(data[i], i));
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

// Управление видимостью карты.
var setMapVisibility = function (isVisible) {
  if (isVisible) {
    elementMap.classList.remove('map--faded');
  } else {
    elementMap.classList.add('map--faded');
  }
};

// Управление изменением формы подачи объявления.
var setAdFormDisabled = function (disabled) {
  if (disabled) {
    adForm.classList.remove('ad-form--disabled');
  } else {
    adForm.classList.add('ad-form--disabled');
  }
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

// Проверка на то, что страница активирована.
var isActivatePage = function () {
  if (elementMap.classList.contains('map--faded')) {
    return false;
  }
  return true;
};

// Обработчик активации страницы.
var onMainPinClickHandler = function () {
  if (!isActivatePage()) {
    activatePage();
    getValueOfAddressInputField();
  }
};

// Событие активации страницы при помощи левой кнопки мыши.
mainPin.addEventListener('click', onMainPinClickHandler);

// Функция активации страницы.
var activatePage = function () {
  drawPins(makeArrayOfAdvertisments());
  isActivePage = true;
  setMapVisibility(isActivePage);
  enableFields(fieldElements);
  enableFields(selectsOfMapFilters);
  setAdFormDisabled(isActivePage);
  addressInput.readOnly = true;
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
var setPriceValue = function () {
  priceInputAd.min = MATCHING_TYPE_WITH_MIN_PRICE[typeInputAd.value];
  priceInputAd.placeholder = MATCHING_TYPE_WITH_MIN_PRICE[typeInputAd.value];
};

// Событие проверки соответствия типа жилья с ценой за ночь.
priceInputAd.addEventListener('input', function () {
  setPriceValue();
});

// Событие проверки соответствия типа жилья с ценой за ночь.
typeInputAd.addEventListener('input', function () {
  setPriceValue();
});

// Синхронизация заезда и выезда.
timeoutSelectAdForm.addEventListener('change', function () {
  timeinSelectAdForm.value = timeoutSelectAdForm.value;
});

// Синхронизация заезда и выезда.
timeinSelectAdForm.addEventListener('change', function () {
  timeoutSelectAdForm.value = timeinSelectAdForm.value;
});

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

// Добавляем доступные удобства в объявление.
var renderFeaturesInAd = function (dataItem, cardFeatures) {
  cardFeatures.innerHTML = '';
  for (var i = 0; i < dataItem.offer.features.length; i++) {
    var elementInCardFeatures = document.createElement('li');
    elementInCardFeatures.classList.add('popup__feature');
    elementInCardFeatures.classList.add('popup__feature--' + dataItem.offer.features[i]);
    cardFeatures.appendChild(elementInCardFeatures);
  }
};

// Добавляем фотографии в объявление.
var renderPhotosInAd = function (dataItem, cardPhotos) {
  var cardPhotoElement = cardPhotos.querySelector('.popup__photo');
  if (dataItem.offer.photos.length === 0) {
    cardPhotos.innerHTML = '';
  } else {
    for (var i = 0; i < dataItem.offer.photos.length; i++) {
      if (i === 0) {
        cardPhotoElement.src = dataItem.offer.photos[i];
      } else {
        var clonePhotoElement = cardPhotoElement.cloneNode(true);
        clonePhotoElement.src = dataItem.offer.photos[i];
        cardPhotos.appendChild(clonePhotoElement);
      }
    }
  }
};

// Создаем объявление на основе данных.
var generateCardBlock = function (dataCard) {
  var cardTemplate = mapCardTemplate.cloneNode(true);
  var cardFeatures = cardTemplate.querySelector('.popup__features');
  var cardPhotos = cardTemplate.querySelector('.popup__photos');
  var cardTitle = cardTemplate.querySelector('.popup__title');
  var cardAddress = cardTemplate.querySelector('.popup__text--address');
  var cardPrice = cardTemplate.querySelector('.popup__text--price');
  var cardType = cardTemplate.querySelector('.popup__type');
  var cardCapacity = cardTemplate.querySelector('.popup__text--capacity');
  var cardTime = cardTemplate.querySelector('.popup__text--time');
  var cardDescription = cardTemplate.querySelector('.popup__description');
  var cardAvatar = cardTemplate.querySelector('.popup__avatar');

  cardTitle.textContent = dataCard.offer.title;
  cardAddress.textContent = dataCard.offer.address;
  cardPrice.textContent = dataCard.offer.price + '₽/ночь';
  cardType.textContent = TYPES_CORRELATION_MAP[dataCard.offer.type];
  cardCapacity.textContent =
    dataCard.offer.rooms +
    uniteNumberWithWords(dataCard.offer.rooms, TRANSCRIPT_ROOMS) +
    dataCard.offer.guests +
    uniteNumberWithWords(dataCard.offer.guests, TRANSCRIPT_GUESTS);
  cardTime.textContent = 'Заезд после ' + dataCard.offer.checkin + ', выезд до ' + dataCard.offer.checkout;
  cardDescription.textContent = dataCard.offer.description;
  renderFeaturesInAd(dataCard, cardFeatures);
  renderPhotosInAd(dataCard, cardPhotos);
  cardAvatar.src = dataCard.author.avatar;
  return cardTemplate;
};

// Создаем объявление в разметке.
var createCard = function (dataCard) {
  elementMap.insertBefore(dataCard, mapFilters);
};

// Функция удаления объявления из разметки.
var closeAdPopup = function () {
  var adPopup = elementMap.querySelector('.map__card');
  if (elementMap.contains(adPopup)) {
    elementMap.removeChild(adPopup);
  }
};

// Событие открытия объявления по клику.
pinsBlock.addEventListener('click', function (evt) {
  if (evt.target.closest('.map__pin:not(.map__pin--main)')) {
    closeAdPopup();
    var currentData = evt.target.closest('.map__pin').dataset.index;
    createCard(generateCardBlock(makeArrayOfAdvertisments()[currentData]));
  }
});

// Событие закрытия объявления по клику на крестик.
document.addEventListener('click', function (evt) {
  if (evt.target.matches('.popup__close')) {
    closeAdPopup();
  }
});

// Событие закрытия объявления при нажатии на esc.
document.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeAdPopup();
  }
});

// Запускаем функции.
var init = function () {
  checkRoomsAndCapacityValidity();
  setOptionsForRooms();
  disableFields(fieldElements);
  disableFields(selectsOfMapFilters);
  getValueOfAddressInputField();
  setPriceValue();
};

init();
