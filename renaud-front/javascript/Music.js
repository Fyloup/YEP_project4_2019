window.$ = window.jQuery = require('jquery');
//let { dialog } = require('electron').remote;
let fs = require('fs');
let mm = require('musicmetadata');

let button_file = $('#file_button_music');
let button_dir = $('#dir_button_music');
let button_skip = $('#skip_button_music');
let button_stop = $('#stop_button_music');
let music_files = []
let music_files_save = []
// let current_dir = ''
let current_music = ''

button_file.on('click', function() {
  dialog.showOpenDialog({ properties: ['openFile'], title: "Select a music file", filters: [
    { extensions: ['mp3', 'ogg'] },
  ] }).then(function(file) {
    metadata_retriever(file.filePaths[0]);
    let type = file.filePaths[0].includes('.mp3') ? 'audio/mpeg' : 'audio/ogg';
    let player = $('#music')[0];
    $('#music_player').attr('src', file.filePaths[0]).attr('type', type);
    player.pause();
    player.load();
    player.oncanplaythrough = player.play();
    music_files_save = [];
    music_files = [];
    current_music = file.filePaths[0];
  });
});

button_dir.on('click', function() {
  dialog.showOpenDialog({ properties: ['openDirectory'], title: "Select the directory containing your music files" }).then(function(file) {
    let files = fs.readdirSync(file.filePaths[0]);
    let tmp = files.filter(elem => elem.includes('.mp3') || elem.includes('.ogg'));
    tmp.forEach(elem => music_files.push(file.filePaths[0] + '/' + elem));
    music_files_save = music_files.slice();
    current_music = '';
    let m = music_files.shift();
    play_music(m);
  });
});

button_skip.on('click', function() {
  console.log($('#music'));
  $('#music')[0].currentTime = $('#music')[0].duration;
});

button_stop.on('click', function() {
  music_files = [];
  music_files_save = [];
  current_music = '';
  let player = $('#music')[0];
  player.pause();
  $('#music_player').attr('src', '');
  player.load();
  $('#music_img').remove();
  $('#music_title').remove();
  $('#music_artist').remove();
});

function play_music(music) {
  if (!music || music === '')
    return;
  metadata_retriever(music);
  let type = music.includes('.mp3') ? 'audio/mpeg' : 'audio/ogg';
  let player = $('#music')[0];
  $('#music_player').attr('src', music).attr('type', type);
  player.pause();
  player.load();
  player.oncanplaythrough = player.play();
}


function metadata_retriever(file) {
  mm(fs.createReadStream(file), function (err, metadata) {
    if (err) {
      console.log(err);
      return;
    }
    let img = $('#music_img');
    let title = $('#music_title');
    let artist = $('#music_artist');
    if (!img.length && metadata.picture.length)
      $('.metadata').prepend('<img id="music_img" width="760" height="570" src="data:image/jpeg;base64, ' + metadata.picture[0].data.toString('base64') + '" >');
    else if (metadata.picture.length)
      $('#music_img').attr('src', 'data:image/jpeg;base64, ' + metadata.picture[0].data.toString('base64'));
    else if (!metadata.picture.length && $('#music_img').length)
      $('#music_img').remove();
    if (!title.length && metadata.title)
      $('.metadata').append('<p style="color:black;font-size:20px;" id="music_title">' + metadata.title + '</p>');
    else if (metadata.title)
      $('#music_title').text(metadata.title);
    else if (!metadata.title && $('#music_title').length)
      $('#music_title').remove();
    if (!artist.length && metadata.artist.length)
      $('.metadata').append('<p style="color:black;font-size:20px;" id="music_artist">' + metadata.artist[0] + '</p>');
    else if (metadata.artist.length)
      $('#music_artist').text(metadata.artist[0]);
    else if (!metadata.artist.length && $('#music_artist').length)
      $('#music_artist').remove();
  });
}

$('#music').on('ended', function() {
  let music = ''
  if (!music_files.length && music_files_save.length && $('#repeat_music')[0].checked == true) {
    music_files = music_files_save.slice();
    music = music_files.shift();
  } else if (music_files.length) {
    music = music_files.shift();
  } else if ($('#repeat_music')[0].checked == true) {
    music = current_music;
  }
  if (!music || music == '') {
    $('#music_player').attr('src', '');
    $('#music_img').remove();
    $('#music_title').remove();
    $('#music_artist').remove();
    $('#music')[0].load();
    return;
  }
  play_music(music)
});
