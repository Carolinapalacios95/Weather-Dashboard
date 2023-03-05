var submitBtn = $("#submit-button");


var cities = [];

function getCity() {

}



function formSubmit() {
    console.log("submit listener works")

    submitBtn.submit(function(event) {
        event.preventDefault();

        var newCity= $("#new-city").val();

        if (!newCity) {
            return;
        }

        /* var newCityArray = {
                city: newCity
        } */

        //addCity();
        getCity();
    })
}

$(function() {
    console.log("page and jquery initialized");
    formSubmit();
});