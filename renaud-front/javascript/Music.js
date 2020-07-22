let button_music_file;
let button_music_dir;
let button_skip;
let button_stop;
let music_files = []
let music_files_save = []
let current_music = ''

window.api.receive("fromMain", (type, data) => {

  if (type === "page" && data.page === "Music") {
    button_music_file = document.getElementById("file_button_music")
    button_music_dir = document.getElementById("dir_button_music")
    button_skip = document.getElementById("skip_button_music")
    button_stop = document.getElementById("stop_button_music")
  
    button_music_file.addEventListener('click', function() {
      window.api.send("toMain", "ReadFile", "")
    });
    
    button_music_dir.addEventListener('click', function() {
      window.api.send("toMain", "ReadMusicDir")
    });
    
    button_skip.addEventListener('click', function() {
      let controls = document.getElementById("music-controls")
      controls.currentTime = controls.duration
    });
    
    button_stop.addEventListener('click', function() {
      music_files = [];
      music_files_save = [];
      current_music = '';
      let player = document.getElementById("music-controls")
      let source = document.getElementById("music_player")
      source.src = ""
      player.pause();
      player.load();
      let metadata = document.getElementById("metadata")
      metadata.style.display = "none"
    });
  }
  if (type === "file") {
    console.log("music to load: ", data.file)
    metadata_retriever(data.file, data.path)
  }
  if (type === "dirMusicFiles") {
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
  console.log("music: ", music)
  let type = music.includes('.mp3') ? 'audio/mpeg' : 'audio/ogg';
  let controls = document.getElementById("music-controls")
  let player = document.getElementById("music_player")
  player.src = music
  player.type = type
  controls.pause();
  controls.load();
  controls.oncanplaythrough = controls.play();
}

function metadata_retriever(metadata, path) {

  console.log("metadata: ", metadata)
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
  let player = document.getElementById("music-controls")
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
    return;
  }
  play_music(music)
})