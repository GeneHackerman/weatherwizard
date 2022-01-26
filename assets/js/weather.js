var searchHistoryList = $('#search-history-list');
var searchCityInput = $("#search-city");
var searchCityButton = $("#search-city-button");
var clearHistoryButton = $("#clear-history");

var currentCity = $("#current-city");
var currentTemp = $("#current-temp");
var currentHumidity = $("#current-humidity");
var currentWindSpeed = $("#current-wind-speed");
var UVindex = $("#uv-index");

var weatherContent = $("#weather-content");


// get access to Openweather API
var APIkey = "4d8854658d126c12ed6db045d688dd4d";

// city array
var cityList = [];

// find current date and display in title
var currentDate = moment().format('L');
$("#current-date").text("(" + currentDate + ")");

// check if search history exists when page loads
initializeHistory();
showClear();

// will search for city and display the current weather conditions 
$(document).on("submit", function() {
    event.preventDefault();

    // searches for city 
    var searchValue = searchCityInput.val().trim();

    currentConditionsRequest(searchValue)
    searchHistory(searchValue);
    searchCityInput.val("");
});

// upon submit, city will be added to history
searchCityButton.on("click", function(event) {
    event.preventDefault();

    // grab value entered in search bar
    var searchValue = searchCityInput.val().trim();

    currentConditionsRequest(searchValue)
    searchHistory(searchValue);
    searchCityInput.val("");
}); 

// clear sidebar of past searche queries
clearHistoryButton.on("click", function() {
    // empty out city list array
    cityList = [];
    // update city list history in local storage
    listArray();

    $(this).addClass("hide");
});

// clicking on search history sidebar list will display the info of that city clicked
searchHistoryList.on("click", "li.city-btn", function(event) {
    //console.log($(this).data("value"));
    var value = $(this).data("value");
    currentConditionsRequest(value);
    searchHistory(value);
});

