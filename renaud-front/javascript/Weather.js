var loc = document.getElementById("location");
var temp = document.getElementById("weather");
var desc = document.getElementById("desc");
var meteoImg = document.getElementById("meteo-image");
var minTemp = document.getElementById("min-temp");
var maxTemp = document.getElementById("max-temp");
var wind = document.getElementById("wind");

var axios = require("axios");
var NodeGeocoder = require('node-geocoder');

var options = {
    provider: 'google',
    httpAdapter: 'https', // Default
    apiKey: process.env.GOOGLE_API_KEY,
    formatter: 'json' // 'gpx', 'string', ...
  };
  
var geocoder = NodeGeocoder(options);

if (navigator.geolocation) {
    console.log("oui")
    navigator.geolocation.getCurrentPosition(getInfos);
} else { 
    alert("Geolocation is not supported by this browser.")
}

function getInfos(position) {
    console.log("success")
    const latitude = position.coords.latitude 
    const longitude = position.coords.longitude
    geocoder.reverse({lat:latitude, lon:longitude})
    .then((res) => {
        console.log("get a response")
        console.log(res)
        getMeteo(res[0].city, res[0].country)
    })
    .catch((err) => {
        console.log("erreur")
        console.log(err)
    })
}

function getMeteo(city, country) {
    axios({
        "method":"GET",
        "url":"https://community-open-weather-map.p.rapidapi.com/weather",
        "headers": {
            "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
            "x-rapidapi-key": "98d445bf23msh6981bf596ba6aeap19d708jsn0ea2cb9278f8",
            "useQueryString": true
        },
        "params": {
            "q": country,
            "units": "metric"
        }
        })
        .then((response)=>{
            console.log("Get response")
            loc.innerHTML =  country + ", " + city
            temp.innerHTML = response.data.main.temp + " °C"
            desc.innerHTML = "Weather: " + response.data.weather[0].description
            minTemp.innerHTML = "Min. Temperature: " + response.data.main.temp_min + " °C"
            maxTemp.innerHTML = "Max. Temperature: " + response.data.main.temp_max + " °C"
            wind.innerHTML = "Wind speed: " + response.data.wind.speed + " km/h"
            var iconcode = response.data.weather[0].icon
            var imgsrc = "http://openweathermap.org/img/w/" + iconcode + ".png"
            meteoImg.setAttribute('src', imgsrc)
            meteoImg.setAttribute('width', '85px')
            meteoImg.setAttribute('height', '85px')
            console.log(response.data)
        })
        .catch((error)=>{
            console.log(error)
        })  
}