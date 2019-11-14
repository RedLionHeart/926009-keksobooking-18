'use strict';

(function () {
  var ApiPaths = {
    DATA: 'https://js.dump.academy/keksobooking/data',
    POST: 'https://js.dump.academy/keksobooking'
  };
  var SUCCESS_STATUS = 200;
  var TIMEOUT = 10000;

  var initXHR = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_STATUS) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT;

    return xhr;
  };

  // Получение списка объявлений
  var getKeksobookingData = function (onLoad, onError) {
    var xhr = initXHR(onLoad, onError);
    xhr.open('GET', ApiPaths.DATA);
    xhr.send();
  };

  // Отправка формы объявления
  var sendKeksobookingData = function (data, onLoad, onError) {
    var xhr = initXHR(onLoad, onError);
    xhr.open('POST', ApiPaths.POST);
    xhr.send(data);
  };

  window.backend = {
    getKeksobookingData: getKeksobookingData,
    sendKeksobookingData: sendKeksobookingData
  };
})();
