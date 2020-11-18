
var search = $("#search");
var searchButton = $("#searchBtn");
var searchHistory = $("#searchHistory");
var weatherCol = $("#weatherBox");

var apiKey = "552a2fa7c58594d2194297ac5534eabc";
var currentWeatherUrl;
var forecastUrl;
var storedSearches = [];

var storedSearches = localStorage.getItem("storedSearches");

if (storedSearches != null)
    storedSearches = storedSearches.split(",");

var nowDate = new Date();
var currentDate = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + nowDate.getDate();

function populateCurrentWeather() {

    $.ajax({
        url: currentWeatherUrl,
        method: "GET"
    }).then(function (res) {

        var currentWeatherObj = {
            location: res.name,
            date: currentDate,
            weatherIcon: res.weather[0].icon,
            temperature: Math.round(res.main.temp),
            humidity: res.main.humidity,
            wind: res.wind.speed,
            uvIndex: 0,
            uvIntensity: ""
        };

        currentWeatherObj.date = formatDates(currentWeatherObj.date);

        var latitude = res.coord.lat;
        var longitude = res.coord.lon;
        var currentUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&appid=" + apiKey;

        $.ajax({
            url: currentUrl,
            method: "GET"
        }).then(function (res) {

            currentWeatherObj.uvIndex = res.value;
            var currentWeatherCard = 
                $('<div class="card"><div class="card-body"><h5 class="card-title">' + currentWeatherObj.location + ' (' + currentWeatherObj.date + ') ' +
                '<p class="card-text">Temperature: ' + currentWeatherObj.temperature + ' F</p>' +
                '<p class="card-text">Humidity: ' + currentWeatherObj.humidity + '%</p>' +
                '<p class="card-text">Wind Speed: ' + currentWeatherObj.wind + ' MPH</p>' +
                '<p class="card-text">UV Index:' + currentWeatherObj.uvIntensity + '">' + currentWeatherObj.uvIndex + z)
            $("#weatherBox").append(currentWeatherCard);
        });

        renderStoredSearches();

    });
}

function populateWeatherForecast() {

    var fiveDayForecastArray = [];

    $.ajax({
        url: forecastUrl,
        method: "GET"
    }).then(function (res) {

        console.log(res);

        var temporaryForecastObj;

        for (var i = 4; i < res.list.length; i += 8) {
            temporaryForecastObj = {
                date: res.list[i].dt_txt.split(" ")[0],
                weatherIcon: res.list[i].weather[0].icon,
                temperature: Math.round(res.list[i].main.temp),
                humidity: res.list[i].main.humidity
            };
            fiveDayForecastArray.push(temporaryForecastObj);
        }

        for (var i = 0; i < fiveDayForecastArray.length; i++) {
            fiveDayForecastArray[i].date = formatDates(fiveDayForecastArray[i].date);
        }

        var forecastHeader = $('<h1>5-Day Forecast:</h1>');
        $("#forecastHead").append(forecastHeader);

        for (var i = 0; i < fiveDayForecastArray.length; i++) {
            var forecastCard = $('<div class="col-lg-2 col-sm-3 mb-1"><span class="badge badge-primary"><h5>' + fiveDayForecastArray[i].date + '</h5>' +
                '<p><img class="w-100" src="http://openweathermap.org/img/wn/' + fiveDayForecastArray[i].weatherIcon + '@2x.png"></p>' +
                '<p>Temp: ' + fiveDayForecastArray[i].temperature + 'F</p>' +
                '<p>Humidity: ' + fiveDayForecastArray[i].humidity + '%</p>' +
                '<span></div>');
            $("#forecastRow").append(forecastCard);
        }


    });
}
function renderStoredSearches() {

    $("#searchHistory").empty();

    if ($("#search").val() != "") {
        if (storedSearches.indexOf($("#search").val()) != -1) {
            storedSearches.splice(storedSearches.indexOf($("#search").val()), 1)
        }
        storedSearches.unshift($("#search").val());
    }

    localStorage.setItem("storedSearches", storedSearches);

    for (var i = 0; i < storedSearches.length; i++) {
        var newListItem = $('<li class="list-group-item">' + storedSearches[i] + '</li>');
        $("#searchHistory").append(newListItem);
    }

    $("li").on("click", function () {
        $("#search").val($(event.target).text());
        searchButton.click();
    });
}

function formatDates(data) {
    var dateArray = data.split("-");
    var formattedDate = dateArray[1] + "/" + dateArray[2] + "/" + dateArray[0];
    return formattedDate
}

searchButton.on("click", function () {

    currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + search.val() + "&units=imperial&appid=" + apiKey;
    forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + search.val() + "&units=imperial&appid=" + apiKey;

    $("#weatherBox").empty();
    $("#forecastHead").empty();
    $("#forecastRow").empty();

    populateCurrentWeather();
    populateWeatherForecast();
});

$("#search").keypress(function () {
    if (event.keyCode == 13)
        searchButton.click();
});



renderStoredSearches();