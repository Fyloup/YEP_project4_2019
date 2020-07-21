window.$ = window.jQuery = require('jquery')

const { dialog } = require('electron').remote;
const main = document.getElementById("main")
const remote = require('electron').remote
let w = remote.getCurrentWindow()

// GET THE BUTTON IN THE NAVBAR VIA THE ID
const create_btn = document.getElementById("Videos-Creation")
const music_btn = document.getElementById("Music")
const weather_btn = document.getElementById("Weather")
const twitch_btn = document.getElementById("Twitch")
//const movies_btn = document.getElementById("Movies")
//const videos_btn = document.getElementById("Videos")
const power_btn = document.getElementById("power_button")
const picture_btn = document.getElementById("Picture")
const ytb_btn = document.getElementById("Youtube")

// LISTEN TO "CLICK" EVENT ON YOUR MODULE BUTTON, THEN LOAD THE RIGHT HTML FILE FOR THIS MODULE
// DON'T FORGET TO SET MAIN.INNERHTML='' TO RESET CONTENT !

music_btn.addEventListener("click", function(e) {
    main.innerHTML = ''
    $("#main").load("Music.html");
})
weather_btn.addEventListener("click", function(e) {
    main.innerHTML = ''
    $("#main").load("Weather.html");
})
ytb_btn.addEventListener("click", function(e) {
    main.innerHTML = ''
    $("#main").load("Youtube.html");
})
twitch_btn.addEventListener("click", function(e) {
    main.innerHTML = ''
    $("#main").load("Twitch.html");
})
    /*
    videos_btn.addEventListener("click", function(e) {
    main.innerHTML = ''
    $("#main").load("Videos.html");
})
movies_btn.addEventListener("click", function(e) {
    main.innerHTML = ''
    $("#main").load("Movies.html");
})*/
picture_btn.addEventListener("click", function(e) {
    main.innerHTML = ''
    $("#main").load("Picture.html");
})
create_btn.addEventListener("click", function(e) {
    main.innerHTML = ''
    $("#main").load("VideosCreation.html");
})
power_btn.addEventListener("click", function(e) {
    w.close()
})
