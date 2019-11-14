'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var PREVIEW_IMAGE_BLOCK_WIDTH = 70;
  var PREVIEW_IMAGE_BLOCK_HEIGHT = 70;

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
            previewItem.width = PREVIEW_IMAGE_BLOCK_WIDTH;
            previewItem.height = PREVIEW_IMAGE_BLOCK_HEIGHT;
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
