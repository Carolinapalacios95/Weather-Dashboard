var citySearchForm = $("#search-city")
var submitBtn = $("#submit-button");


//Generates current time and date
var date = dayjs().format('dddd, MMMM D YYYY');
var dateTime = dayjs().format('YYYY-MM-DD HH:MM:SS')

var cities = [];
var key = "d743387c66c5b9bb1ef18f3d12ba90c7";

$(function() {
    console.log("page and jquery initialized");

    
    loadCities();
    
});

function formSubmit() {

    citySearchForm.submit(function(event) {
        console.log("submit button works")
        event.preventDefault();

        var city= $("#new-city").val();

        if (!city) {
            console.log('City search is blank!');
            return;
        }
        
        getCoordinates(city);
        // loadCities()
    });
}

function cityClick() {

    var cityButton = $('.city');

    cityButton.on("click", function (event) {
        event.preventDefault()
        
        console.log("city button click works",($(event.target).text()))
        
        city = $(event.target).text()
        getCoordinates(city)
});
}

function getCoordinates(city) {
    console.log("get coordinates works")
    console.log("city name", city)
    fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=' + key)
        .then(function(response) {
            return response.json();
        })
        .then(function(data){
            console.log(data);
            console.log("fetched coordinates", data[0].lat, data[0].lon)

            var lat= data[0].lat
            var lon= data[0].lon

            console.log(city)

            addCity(city);
            getCurrentWeather(lat, lon);
            getForecast(lat, lon);
        });
};

function addCity (city) {
    console.log("add city works")

    var cityIndex = cities.indexOf(city);
    if (cityIndex !== -1) {
        cities.splice(cityIndex, 1);
    } 

    cities.unshift(city)
    console.log("cities array", cities)
    saveCity(city);
    updateCityList(city);
    
    $('#new-city').val("");
}

function saveCity(city) {
    console.log("save cities local storage works")

    localStorage.setItem('cities', JSON.stringify(cities));
}

function loadCities(city) {
    var citiesStored = JSON.parse(localStorage.getItem('cities'));

    if (citiesStored === null) {
        var city= "New York";
        // var lat = 40.7127281;
        // var lon= -74.0060152;

            var cities = {
                city: city
            }
            console.log("initial city", city)

            getCoordinates(city);
            formSubmit();
            // addCity(city);
            // getCurrentWeather(lat, lon);
            // getForecast(lat, lon);

        // updateCityList(cities);

    } else if (citiesStored !== null) {
		var cities = citiesStored

        for (var i=0; i < cities.length; i++) {
    // cities = JSON.parse(localStorage.getItem('cities'));
    if (!cities) {
        cities = [];
        return;
    };
    
    console.log("loaded cities works");

    
    getCoordinates(cities[0]);
    updateCityList(cities[i]);
    formSubmit();
    }
    }
}
    
function updateCityList(city) {
    console.log("update city list on page works");
    
    cities = JSON.parse(localStorage.getItem('cities'));

    var $cityList = $('#city-list');

    // $cityList.text("");
    
    var citiesHtml = "";

    

    for (var i=0; i < cities.length; i++) {
        citiesHtml += '<row class="row btnRow">';
        citiesHtml += '<button class="btn btn-light btn-outline-secondary city">' + cities[i] + '</button>';
        citiesHtml += '</row>';
    }

    $cityList.html(citiesHtml);

    cityClick();
    
}

function getForecast(lat, lon) {
    console.log("get forecast with coordinates:" + lat + "/" + lon)
    fetch('https://api.openweathermap.org/data/2.5/forecast?lat=' + lat +  '&lon=' + lon + '&units=imperial&appid=' + key)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log("fetched forecast data", data)
            displayForecast(data);
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

function displayForecast(data) {
    console.log("display forecast works")

     var fiveForecastEl = $('#fiveDayForecast');
    
    fiveForecastEl.empty();
    
    var fiveDayArray = data.list;
		var forecast = [];
		//Made a object that would allow for easier data read
		$.each(fiveDayArray, function (index, value) {
			testObj = {
				date: value.dt_txt.split(' ')[0],
				temp: value.main.temp,
				icon: value.weather[0].icon,
				humidity: value.main.humidity,
                wind: value.wind.speed
			}

			if (value.dt_txt.split(' ')[1] === "12:00:00") {
				forecast.push(testObj);
			}
		})
		//Inject the cards to the screen 
		for (let i = 0; i < 5; i++) {

			var divElCard = $('<div>');
			divElCard.attr('class', 'card  bg-light mb-3 cardOne');
			divElCard.attr('style', 'max-width: 215px;');
			fiveForecastEl.append(divElCard);

			var divElHeader = $('<div>');
			divElHeader.attr('class', 'card-header')
			var dayFormat = dayjs(`${forecast[i].date}`).format('MM-DD-YYYY');
			divElHeader.text(dayFormat);
			divElCard.append(divElHeader)

			var divElBody = $('<div>');
			divElBody.attr('class', 'card-body');
			divElCard.append(divElBody);

			var divElIcon = $('<img>');
			divElIcon.attr('class', 'icons');
			divElIcon.attr('src', `https://openweathermap.org/img/wn/${forecast[i].icon}@2x.png`);
			divElBody.append(divElIcon);

			//Temp
			var pElTemp = $('<p>').text('Temperature: ' + forecast[i].temp + ' °F');
			divElBody.append(pElTemp);

			//Humidity
			var pElHumid = $('<p>').text('Humidity: ' + forecast[i].humidity + ' %');
			divElBody.append(pElHumid);

            //Wind
            var pwindEl = $('<p>').text('Wind: ' +  forecast[i].wind + ' MPH');
            divElBody.append(pwindEl);
        }
}