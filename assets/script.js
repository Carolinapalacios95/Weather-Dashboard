var citySearchForm = $("#search-city")
var submitBtn = $("#submit-button");



var cities = [];
var key = "d743387c66c5b9bb1ef18f3d12ba90c7";


function getCity(lat, lon) {
    console.log("get city with coordinates:" + lat + "/" + lon)
    fetch('https://api.openweathermap.org/data/2.5/forecast?lat=' + lat +  '&lon=' + lon + '&appid=' + key)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log("fetched forecast data", data)
        })
}


function getCoordinates(newCity) {
    console.log("get coordinates works")
    fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + newCity + '&limit=1&appid=' + key)
        .then(function(response) {
            return response.json();
        })
        .then(function(data){
            console.log(data);
            console.log("fetched coordinates", data[0].lat, data[0].lon)

            var lat= data[0].lat
            var lon= data[0].lon

              
            getCity(lat, lon)
        });
};



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
    });
}

$(function() {
    console.log("page and jquery initialized");
    formSubmit();
});