var citySearchForm = $("#search-city")
var submitBtn = $("#submit-button");

//Generates current time and date
var date = dayjs().format('dddd, MMMM D YYYY');
var dateTime = dayjs().format('YYYY-MM-DD HH:MM:SS')

var cities = [];
var key = "d743387c66c5b9bb1ef18f3d12ba90c7";

$(function() {
    console.log("page and jquery initialized");

    formSubmit();
    loadCities();
});

function formSubmit() {

    citySearchForm.submit(function(event) {
        console.log("submit button works")
        event.preventDefault();

        var newCity= $("#new-city").val();

        if (!newCity) {
            console.log('City search is blank!');
            return;
        }
        
        getCoordinates(newCity);
        // loadCities()
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

function addCity (city) {
    console.log("add city works")
    cities.unshift(city)
    console.log("cities array", cities)
    saveCity();
    updateCityList();
    
    $('#new-city').val("");
}

function saveCity() {
    console.log("save cities local storage works")
    localStorage.setItem('cities', JSON.stringify(cities));
}

function loadCities() {
    var citiesStored = JSON.parse(localStorage.getItem('cities'));

	if (citiesStored !== null) {
		cities = citiesStored
	}
    //cities = JSON.parse(localStorage.getItem('cities'));
    if (!cities) {
        cities = [];
        return;
    };
    
    console.log("loaded cities works");

    for (var i=0; i < cities.length; i++) {
        var lat = cities[i].latitude;
        var lon = cities[i].longitude
    
    // getCurrentWeather(lat, lon);
    // getForecast(lat, lon);
    updateCityList();
    }
}
    
function updateCityList() {
    console.log("update city list on page works");

    var $cityList = $('#city-list');

    var citiesHtml = "";

    for (var i=0; i < cities.length; i++) {
        citiesHtml += '<row class="row btnRow">';
        citiesHtml += '<button class="btn btn-outline-secondary city" data-index="'+i+'">' + cities[i].city + '</button>';
        citiesHtml += '</row>';
    }

    $cityList.html(citiesHtml);

    
}

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
    fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + lat +  '&lon=' + lon + '&units=imperial&appid=' + key)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log("fetched current weather data", data)
            displayCurrentWeather(data);
        })
        
}

function displayCurrentWeather(data) {
    console.log("display current weather works")

    var currentCardBody = $("#current-card-body")
    $(currentCardBody).empty();

    $('#city-name-today').text(data.name)
    $('#card-today-date').text(date);

    $('.icons').attr('src', 'https://openweathermap.org/img/w/' + data.weather[0].icon + '.png')

    var tempEl = $('<p>').text('Temperature: ' + data.main.temp + '°F');
    currentCardBody.append(tempEl);

    var windEl = $('<p>').text('Wind: ' + data.wind.speed + ' MPH');
    currentCardBody.append(windEl);

    var humEl = $('<p>').text('Humidity: ' + data.main.humidity + '%')
    currentCardBody.append(humEl);

}


