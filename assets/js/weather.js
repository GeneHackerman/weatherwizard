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
// initializeHistory();
// showClear();

