// window.$ = window.jQuery = require('jquery');
let button_file;
let button_dir;
let button_skip;
let button_stop;
let music_files = []
let music_files_save = []
// let current_dir = ''
let current_music = ''

window.api.receive("fromMain", (type, data) => {

  if (type === "page" && data.page === "Music") {
    button_file = document.getElementById("file_button_music")
    button_dir = document.getElementById("dir_button_music")
    button_skip = document.getElementById("skip_button_music")
    button_stop = document.getElementById("stop_button_music")
  
    button_file.addEventListener('click', function() {
      window.api.send("toMain", "ReadFile", "")
    });
    
    button_dir.addEventListener('click', function() {
      window.api.send("toMain", "ReadDir")
    });
    
    button_skip.addEventListener('click', function() {
      // console.log($('#music'));
      // $('#music')[0].currentTime = $('#music')[0].duration;
      let controls = document.getElementById("music-controls")
      controls.currentTime = controls.duration
    });
    
    button_stop.addEventListener('click', function() {
      music_files = [];
      music_files_save = [];
      current_music = '';
      // let player = $('#music')[0];
      let player = document.getElementById("music-controls")
      let source = document.getElementById("music_player")
      source.src = ""
      player.pause();
      // $('#music_player').attr('src', '');
      player.load();
      let metadata = document.getElementById("metadata")
      metadata.style.display = "none"
      // $('#music_img').remove();
      // $('#music_title').remove();
      // $('#music_artist').remove();
    });
  }
  if (type === "file") {
    console.log("music to load: ", data.file)
    metadata_retriever(data.file, data.path)
  }
  if (type === "dirFiles") {
    console.log("data dir: ", data)
    let tmp = data.files.filter(elem => elem.includes('.mp3') || elem.includes('.ogg'));
    tmp.forEach(elem => music_files.push(data.path + '/' + elem));
    music_files_save = music_files.slice();
    current_music = '';
    let m = music_files.shift();
    play_music(m);
  }
})

function play_music(music) {
  if (!music || music === '')
    return;
  // metadata_retriever(music);
  console.log("music: ", music)
  window.api.send("toMain", "ReadFile", music)
  let type = music.includes('.mp3') ? 'audio/mpeg' : 'audio/ogg';
  //let player = $('#music')[0];
  let controls = document.getElementById("music-controls")
  // $('#music_player').attr('src', music).attr('type', type);
  let player = document.getElementById("music_player")
  player.src = music
  player.type = type
  controls.pause();
  controls.load();
  controls.oncanplaythrough = controls.play();
}

function metadata_retriever(metadata, path) {

  console.log("metadata: ", metadata)
  // let img = $('#music_img');
  // let title = $('#music_title');
  // let artist = $('#music_artist');
  let img = document.getElementById("music_img")
  let title = document.getElementById("music_title")
  let artist = document.getElementById("music_artist")
  let info = document.getElementById("metadata")
  info.style.display = "block"

  if (metadata.picture.length) {
    img.src = "data:image/jpeg;base64, " + metadata.picture[0].data.toString('base64')
  } else {
    img.src = "../../resources/images/album.png"
  }

  if (metadata.title) {
    title.textContent = metadata.title
  } else {
    console.log("metadata", metadata)
    title.textContent = "Titre inconnu"
  }

  if (metadata.artist.length) {
    artist.textContent = metadata.artist[0]
  } else {
    artist.textContent = "Artist inconnu"
  }

  let type = path.includes('.mp3') ? 'audio/mpeg' : 'audio/ogg';
  // let player = $('#music-controls')[0];
  let player = document.getElementById("music-controls")
  // $('#music_player').attr('src', file.filePaths[0]).attr('type', type);
  let music = document.getElementById("music_player")
  music.src = path
  music.type = type

  player.pause();
  player.load();
  player.oncanplaythrough = player.play();
  music_files_save = [];
  music_files = [];
  current_music = path;
}

// function metadata_retriever(file) {
//   mm(fs.createReadStream(file), function (err, metadata) {
//     if (err) {
//       console.log(err);
//       return;
//     }
//     let img = $('#music_img');
//     let title = $('#music_title');
//     let artist = $('#music_artist');
//     if (!img.length && metadata.picture.length)
//       $('.metadata').prepend('<img id="music_img" width="760" height="570" src="data:image/jpeg;base64, ' + metadata.picture[0].data.toString('base64') + '" >');
//     else if (metadata.picture.length)
//       $('#music_img').attr('src', 'data:image/jpeg;base64, ' + metadata.picture[0].data.toString('base64'));
//     else if (!metadata.picture.length && $('#music_img').length)
//       $('#music_img').remove();
//     if (!title.length && metadata.title)
//       $('.metadata').append('<p style="color:black;font-size:20px;" id="music_title">' + metadata.title + '</p>');
//     else if (metadata.title)
//       $('#music_title').text(metadata.title);
//     else if (!metadata.title && $('#music_title').length)
//       $('#music_title').remove();
//     if (!artist.length && metadata.artist.length)
//       $('.metadata').append('<p style="color:black;font-size:20px;" id="music_artist">' + metadata.artist[0] + '</p>');
//     else if (metadata.artist.length)
//       $('#music_artist').text(metadata.artist[0]);
//     else if (!metadata.artist.length && $('#music_artist').length)
//       $('#music_artist').remove();
//   });
// }

document.getElementById("music-controls").addEventListener('ended', function() {
  let music = ''
  let player = document.getElementById("music_player")
  let metadata = document.getElementById("metadata")
  let repeat = document.getElementById("repeat_music")

  if (!music_files.length && music_files_save.length && repeat.checked == true) {
    music_files = music_files_save.slice();
    music = music_files.shift();
  } else if (music_files.length) {
    music = music_files.shift();
  } else if (repeat.checked == true) {
    music = current_music;
  }
  if (!music || music == '') {
    player.src = ""
    metadata.style.display = "none"
    // $('#music_player').attr('src', '');
    // $('#music_img').remove();
    // $('#music_title').remove();
    // $('#music_artist').remove();
    // $('#music')[0].load();
    return;
  }
  play_music(music)
})

// $('#music').on('ended', function() {
//   let music = ''
//   if (!music_files.length && music_files_save.length && $('#repeat_music')[0].checked == true) {
//     music_files = music_files_save.slice();
//     music = music_files.shift();
//   } else if (music_files.length) {
//     music = music_files.shift();
//   } else if ($('#repeat_music')[0].checked == true) {
//     music = current_music;
//   }
//   if (!music || music == '') {
//     $('#music_player').attr('src', '');
//     $('#music_img').remove();
//     $('#music_title').remove();
//     $('#music_artist').remove();
//     $('#music')[0].load();
//     return;
//   }
//   play_music(music)
// });
