var citySearchForm = $("#search-city")
var submitBtn = $("#submit-button");



var cities = [];
var key = "d743387c66c5b9bb1ef18f3d12ba90c7";

$(function() {
    console.log("page and jquery initialized");
    formSubmit();
    loadCities();
});

function formSubmit() {
    console.log("submit listener works")

    citySearchForm.submit(function(event) {
        console.log("submit button works")
        event.preventDefault();

        var newCity= $("#new-city").val();

        if (!newCity) {
            console.log('City search is blank!');
            return;
        }
        
        getCoordinates(newCity);

        // how to clear input box text?? newCity.html = "";
    });
}

function getCoordinates(newCity) {
    console.log("get coordinates works")
    console.log("city name", newCity)
    fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + newCity + '&limit=1&appid=' + key)
        .then(function(response) {
            return response.json();
        })
        .then(function(data){
            console.log(data);
            console.log("fetched coordinates", data[0].lat, data[0].lon)

            var lat= data[0].lat
            var lon= data[0].lon

            var city = {
                city: newCity,
                latitude: lat,
                longitude: lon
            }
            console.log(city)

            addCity(city);
            getCurrentWeather(lat, lon);
            getForecast(lat, lon);
        });
};
function getForecast(lat, lon) {
    console.log("get forecast with coordinates:" + lat + "/" + lon)
    fetch('https://api.openweathermap.org/data/2.5/forecast?lat=' + lat +  '&lon=' + lon + '&appid=' + key)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log("fetched forecast data", data)
        })
}

function getCurrentWeather(lat, lon) {
    console.log("get current city weather with coordinates:" + lat + "/" + lon)
    fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + lat +  '&lon=' + lon + '&appid=' + key)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log("fetched current weather data", data)
        })
}

function addCity (city) {
    console.log("add city works")
    cities.unshift(city)
    console.log("cities array", cities)
    saveCity();
    updateCityList();
}

function saveCity() {
    console.log("save cities array works")
    localStorage.setItem('cities', JSON.stringify(cities));
}

function loadCities() {
    cities = JSON.parse(localStorage.getItem('cities'));
    if (!cities) cities = [];
    console.log("loaded jokes work");
    updateCityList();
}

function updateCityList() {
    console.log("update city list on page works");

    var $cityList = $('#city-list');

    var citiesHtml = "";

    for (var i=0; i < cities.length; i++) {
        citiesHtml += '<article data-index="'+i+'">';
        citiesHtml += '<p class="city">' +cities[i].city+ '</p';
        citiesHtml += '</article';
    }

    $cityList.html(citiesHtml);
}