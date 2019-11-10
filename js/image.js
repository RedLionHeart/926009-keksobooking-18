'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  // Функция добавления картинки в соответствующее поле.
  var addPicture = function (fileChooser, previewBlock, multipleImages) {
    var file = fileChooser.files[0];

    if (file) {
      var fileName = file.name.toLowerCase();

      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      if (matches) {
        var reader = new FileReader();
        reader.addEventListener('load', function () {
          if (multipleImages) {
            var previewItem = document.createElement('img');
            previewItem.src = reader.result;
            previewItem.style = 'object-fit: cover; margin-bottom: 8px; margin-right: 10px;';
            previewItem.width = 70;
            previewItem.height = 70;
            previewItem.alt = 'Фотография жилья';
            previewBlock.appendChild(previewItem);
          } else {
            previewBlock.src = reader.result;
          }
        });
        reader.readAsDataURL(file);
      }
    }
  };

  // Функция удаления картинки из блока.
  var removePicture = function (imgContainer) {
    var pictures = imgContainer.querySelectorAll('img');
    pictures.forEach(function (picture) {
      imgContainer.removeChild(picture);
    });
  };

  window.image = {
    addPicture: addPicture,
    removePicture: removePicture
  };
})();
