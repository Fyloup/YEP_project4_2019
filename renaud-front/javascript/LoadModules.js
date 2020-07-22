let main;
// GET THE BUTTON IN THE NAVBAR VIA THE ID
let create_btn;
let music_btn;
let weather_btn;
let twitch_btn;
let power_btn;
let picture_btn;
let ytb_btn;
let currentPage = "";

window.addEventListener('DOMContentLoaded', () => {

    console.log("load modules")
    main = document.getElementById("main")
    create_btn = document.getElementById("Videos-Creation")
    music_btn = document.getElementById("Music")
    weather_btn = document.getElementById("Weather")
    twitch_btn = document.getElementById("Twitch")
    power_btn = document.getElementById("power_button")
    picture_btn = document.getElementById("Picture")
    ytb_btn = document.getElementById("Youtube")

    // LISTEN TO "CLICK" EVENT ON YOUR MODULE BUTTON, THEN LOAD THE RIGHT HTML FILE FOR THIS MODULE
    // DON'T FORGET TO SET MAIN.INNERHTML='' TO RESET CONTENT !

    music_btn.addEventListener("click", function(e) {
        if (currentPage === "" || currentPage !== "Music") {
            main.innerHTML = ''
            loadPage("main", "Music")
        }
    })
    weather_btn.addEventListener("click", function(e) {
        if (currentPage === "" || currentPage !== "Weather") {
            main.innerHTML = ''
            loadPage("main", "Weather")
        }
    })
    ytb_btn.addEventListener("click", function(e) {
        if (currentPage === "" || currentPage !== "Youtube") {
            main.innerHTML = ''
            loadPage("main", "Youtube")
        }
    })
    twitch_btn.addEventListener("click", function(e) {
        if (currentPage === "" || currentPage !== "Twitch") {
            main.innerHTML = ''
            loadPage("main", "Twitch")
        }
    })
    picture_btn.addEventListener("click", function(e) {
        if (currentPage === "" || currentPage !== "Picture") {
            main.innerHTML = ''
            loadPage("main", "Picture")
        }
    })
    create_btn.addEventListener("click", function(e) {
        if (currentPage === "" || currentPage !== "VideosCreation") {
            main.innerHTML = ''
            loadPage("main", "VideosCreation")
        }
    })
    power_btn.addEventListener("click", function(e) {
        window.api.send("toMain", "Close")
    })
})

document.addEventListener("load", (event) => {
    if (event.target.nodeName === "SCRIPT") {
        console.log("script loaded")
    }
})

loadPage = (target, id) => {
    fetch("../html/" + id + ".html")
    .then(data => {
        return data.text()
    })
    .then(data => {
        let script = document.createElement("script")
        let page = document.getElementById(target)
        script.src = "../javascript/"+ id + ".js"
        script.addEventListener("load", () => {window.api.send("toMain", "OnPageLoad", id)})
        page.innerHTML = data;
        page.appendChild(script)
        currentPage = id
    })
}