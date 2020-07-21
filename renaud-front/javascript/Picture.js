window.$ = window.jQuery = require('jquery');
let fs = require('fs');

let button_file = $('#file_button_picture');
let button_dir = $('#dir_button_picture');
let button_prev = $('#prev_button_picture');
let button_next = $('#next_button_picture');
let picture_files = []
let i = 0;

function erasePicture() {
  $('#picture_view').empty();
}
function drawPicture(file) {
  $('#picture_view').append("<img src='" + file + "' height='540' >");
};
button_file.on('click', function() {
  dialog.showOpenDialog({ properties: ['openFile'], title: "Select a picture file", filters: [
    { extensions: ['png', 'jpg', 'jpeg'] },
  ] }).then(function(file) {
    erasePicture();
    drawPicture(file.filePaths[0]);
  });
});

button_dir.on('click', function() {
  dialog.showOpenDialog({ properties: ['openDirectory'], title: "Select the directory containing your picture files" }).then(function(file) {
    let files = fs.readdirSync(file.filePaths[0]);
    let tmp = files.filter(elem => elem.includes('.png') || elem.includes('.jpg') || elem.includes('.jpeg'));
    tmp.forEach(elem => picture_files.push(file.filePaths[0] + '/' + elem));
    console.log(picture_files);
    erasePicture();
    i = 0;
    drawPicture(picture_files[i]);
  });
});

button_prev.on('click', function() {
    erasePicture();
    if (i == 0) {
      i = picture_files.length - 1;
    }
    else {
      i = i - 1;
    }
    drawPicture(picture_files[i]);
});
button_next.on('click', function() {
  erasePicture();
  if (i == picture_files.length - 1) {
    i = 0;
  }
  else {
    i = i + 1;
  }
  drawPicture(picture_files[i]);
});
