// window.$ = window.jQuery = require('jquery');
// let fs = require('fs');

let button_picture_dir;
let button_prev;
let button_next;
let picture_files = []
let pictureIdx = 0;

console.log(window.api, Date.now())

window.api.receive("fromMain", (type, data) => {
  if (type === "page" && data.page === "Picture") {
    button_picture_dir = document.getElementById("dir_button_picture")
    button_prev = document.getElementById("prev_button_picture")
    button_next = document.getElementById("next_button_picture")
    button_picture_dir.addEventListener('click', function() {
      console.log("send dir")
      window.api.send("toMain", "ReadDir")
    });

    button_prev.addEventListener('click', function() {
        erasePicture();
        if (pictureIdx == 0) {
          pictureIdx = picture_files.length - 1;
        }
        else {
          pictureIdx = pictureIdx - 1;
        }
        drawPicture(picture_files[pictureIdx]);
    });
    button_next.addEventListener('click', function() {
      erasePicture();
      if (pictureIdx == picture_files.length - 1) {
        pictureIdx = 0;
      }
      else {
        pictureIdx = pictureIdx + 1;
      }
      drawPicture(picture_files[pictureIdx]);
    });
  }
  if (type === "dirFiles") {
    console.log("pictures data: ", data)
    let tmp = data.files.filter(elem => elem.includes('.png') || elem.includes('.jpg') || elem.includes('.jpeg'));
    tmp.forEach(elem => picture_files.push(data.path + '/' + elem));
    console.log("picture files: ", picture_files);
    erasePicture();
    pictureIdx = 0;
    drawPicture(picture_files[pictureIdx]);
  }
})

function erasePicture() {
  document.getElementById("picture_view").innerHTML = ""
}

function drawPicture(file) {
  let picture = document.createElement("img")
  picture.src = file
  picture.style.height = "540px"
  document.getElementById("picture_view").appendChild(picture)
}