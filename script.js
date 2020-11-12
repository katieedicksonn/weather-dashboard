const APIKEY = "552a2fa7c58594d2194297ac5534eabc";
var currentURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=imperial`;
var forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}&units=imperial`;var nowDate = new Date();
var month = nowDate.getMonth();
var day = nowDate.getDate();
var year = nowDate.getFullYear();
var date = `${month}/${day}/${year}`;
var weather;
var forecast;
var cityArr = JSON.parse(localStorage.getItem("cityWeather")) || [];

function citySearch(searched) {

    $("#weatherBox").empty();
    $.ajax({
        url: currentURL,
        method: "GET"
    }).then(function (response) {
        weather = response;
        currentWeather(weather);
    })
    $.ajax({
        url: forecastURL,
        method: "GET"
    }).then(function (response) {
        forecast = response;
    })
    addCityShortcut(searched);
    localStorage.setItem("cityWeather", JSON.stringify(cityArr))

}