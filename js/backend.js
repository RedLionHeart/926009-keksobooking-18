'use strict';

(function () {
  var API_PATHS = {
    data: 'https://js.dump.academy/keksobooking/data'
  };
  var SUCCESS_STATUS = 200;
  var TIMEOUT = 10000;

  // Функция получения данных с сервера.
  var xhrGet = function (onLoad, onError, apiPath) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.open('GET', apiPath);

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

    xhr.send();
  };

  // Получение списка объявлений
  var getKeksobookingData = function (onLoad, onError) {
    xhrGet(onLoad, onError, API_PATHS.data);
  };

  window.backend = {
    getKeksobookingData: getKeksobookingData
  };
})();
