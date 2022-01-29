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


// request open weather api via user input
function currentConditionsRequest(searchValue) {

    // set url query for AJAX api call
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&units=imperial&appid=" + APIkey;  

    // ajax call
    $.ajax({
        url: queryURL, 
        method: "GET"
    }).then(function(response){
        console.log(response);
        currentCity.text(response.name);
        currentCity.append("<small class='text-muted' id='current date'>");
        $("#current-date").text("(" + currentDate + ")");
        currentCity.append("<img src='https://openweathermap.org/img/w/" + response.weather[0].icon + ".png' alt='" + response.weather[0].main + "' />" )
        currentTemp.text(response.main.temp);
        currentTemp.append("&deg;F"); // appends Farenheit metric
        currentHumidity.text(response.main.humidity + "%");
        currentWindSpeed.text(response.wind.speed + "MPH");

        // set coordinates for latitude and longitude
        var lat = response.coord.lat;
        var lon = response.coord.lon;


        varUVurl = "https://api.openweathermap.org/data/2.5/uvi?&lat=" + lat + "&lon=" + lon + "&appid=" + APIkey;

        // AJAX UV index call
        $.ajax({
            url: UVurl,
            method: "GET"
        }).then(function(response){
            console.log("UV call: ")
            console.log(response);
            UVindex.text(response.value);
        });

        var countryCode = response.sys.country;
        var foreCastURL = "https://api.openweathermap.org/data/2.5/forecast?&units=imperial&appid=" + APIkey + "&lat=" + lat + "&lon=" + lon;


        // AJAX 5day forecast call
        $.ajax({
            url: foreCastURL,
            method: "GET"
        }).then(function(response){
            console.log(response);
            $('#five-day-forecast').empty();
            for (var i = 1; i < response.list.length; i+=8) {

                var forecastDateString = moment(response.list[i].dt_txt).format("L");
                console.log(forecastDateString);

                var forecastCol = $("<div class='col-12 col-md-6 col-lg forecast-day mb-3'>");
                var forecastCard = $("<div class='card'>");
                var forecastCardBody = $("<div class='card-body'>");
                var forecastDate = $("<h5 class='card-title'>");
                var forecastIcon = $("<img>");
                var forecastTemp = $("<p class='card-text mb-0'>");
                var forecastHumidity = $("<p class='card-text mb-0'>");

                
                $('#five-day-forecast').append(forecastCol);
                forecastCol.append(forecastCard);
                forecastCard.append(forecastCardBody);

                forecastCardBody.append(forecastDate);
                forecastCardBody.append(forecastIcon);
                forecastCardBody.append(forecastTemp);
                forecastCardBody.append(forecastHumidity);

                forecastIcon.attr("src", "https://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
                forecastIcon.attr("alt", response.list[i].weather[0].main)
                forecastDate.text(forecastDateString);
                forecastTemp.text(response.list[i].main.temp);
                forecastTemp.prepend("Temp: ");
                forecastTemp.append("&deg;F");
                forecastHumidity.text(response.list[i].main.humidity);
                forecastHumidity.prepend("Humidity: ");
                forecastHumidity.append("%");

                console.log(response.list[i].dt_txt);
                console.log(response.list[i].main.temp);
                console.log(response.list[i].main.humidity);
            }
        });
    });
};


// display and save search history
function searchHistory(searchValue) {
    // grab value entered in search bar
    // var searchValue = searchCityInput.val().trim();

    // array loop
    if (cityList.indexOf(searchValue) === -1) {
        cityList.push(searchValue);

        // list all cities in user history
        listArray();
        clearHistoryButton.removeClass("hide");
        weatherContent.removeClass("hide");
    } else {
        // remove existing value from array
        var removeIndex = cityList.indexOf(searchValue);
        cityList.splice(removeIndex, 1);

        // push value to array again
        cityList.push(searchValue);

        // list all user history cities to display past entries at top of history
        listArray();
        clearHistoryButton.removeClass("hide");
        weatherContent.removeClass("hide");
    }
    console.log(cityList); 

}



// list array at history sidebar
function listArray() {
    // clear elements in sidebar
    searchHistoryList.empty();
    // repopulate history with city array
    cityList.forEach(function(city) {
        var searchHistoryItem = $('<li class="list-group-item city-btn">');
        searchHistoryItem.attr("data-value", city);
        searchHistoryItem.text(city);
        searchHistoryList.prepend(searchHistoryItem);
    });
    
    // update list history in local storage
    localStorage.setItem("cities", JSON.stringify(cityList));
}

// pull city list from local storage and updates city list for search history sidebar
function initializeHistory() {
    if (localStorage.getItem("cities")) {
        cityList = JSON.parse(localStorage.getItem("cities"));
        var lastIndex = cityList.length - 1;
        
        console.log(cityList);

        listArray();
        // displays last viewed city upon refresh
        if (cityList.length !== 0) {
            currentConditionsRequest(cityList[lastIndex]);
            weatherContent.removeClass("hide");
        }
    }
}

// displays clear history btn if cities occupy search history sidebar
function showClear() {
    if (searchHistoryList.text() !== "") {
        clearHistoryButton.removeClass("hide");
    }
}