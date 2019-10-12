'use strict';

(function () {
  var OFFSET_X = 25;
  var OFFSET_Y = 70;

  var mapPinTemplate = document
    .querySelector('#pin')
    .content.querySelector('.map__pin');

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

  window.pin = {
    generatePinBlock: generatePinBlock
  };
})();
