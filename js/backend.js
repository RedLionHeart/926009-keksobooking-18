'use strict';

(function () {
  var API_PATHS = {
    data: 'https://js.dump.academy/keksobooking/data'
  };
  var SUCCESS_STATUS = 200;
  var TIMEOUT = 10000;

  // Функция получения данных с сервера.
  var load = function (onLoad, onError, API_PATH) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.open('GET', API_PATH.data);

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

  window.backend = {
    load: load,
    API_PATHS: API_PATHS
  };
})();
