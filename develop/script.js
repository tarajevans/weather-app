var currentLat;
var currentLng;
var uvi;
var windSpeed;
var humidity;
var temp;
var currentIcon;
var city;
var currDate;
var cityIn = "Boston";
var stateIn = "MA";

var userCity = document.getElementById("cityIn");
var userState = document.getElementById("stateIn");
var displayResults = document.getElementById("displayResults");
let locationIcon = document.querySelector('.weather-icon');
let historyUl = document.getElementById("history");

var places = [["City", "State"]];

$(".container").on("click", "button", function(event) {
    cityIn=$(this).text();
    stateIn=$(this).data("state");
    getCords();
    console.log($(this).data("state"));
})

function createHistory(){
    var currentChildren = historyUl.children
        $(currentChildren).each(function(){
            this.remove();
        });
    for (var i = 0; i < places.length; i++){
        
        var listItem = $("<li>");
        listItem.addClass("historyLi");
        //listItem.text(places[i][0]);
        var cityButton=$("<button>");
        cityButton.text(places[i][0]);
        cityButton.addClass("cityButton");
        $(cityButton.data("state", places[i][1]));
        listItem.append(cityButton);
        $(historyUl).append(listItem);
    }
}

$("#search").click(function(){
    cityIn = capitalizeWord(userCity.value) ;
    stateIn = capitalizeState(userState.value);
    saveCity(cityIn, stateIn);
    getCords();
});

function saveCity(cityIn, stateIn){
    for (var i = 0; i < places.length; i++){
        if (places[i][0] === cityIn && places[i][1] === stateIn){
            places.splice(i, i+1);
            var tempArray = [cityIn, stateIn];
            places.push(tempArray);
            localStorage.setItem("cities", JSON.stringify(places));
        } else {
            var tempArray = [cityIn, stateIn];
            places.push(tempArray);
            localStorage.setItem("cities", JSON.stringify(places));
        }
    }
}

function displayWeather(timeStamp){
    currDate = convertTime(timeStamp);
    var resultString = city + " " + currDate + " " +  "<img src=icons/"+currentIcon+".png>" + " "  + temp + " " + humidity + " " + windSpeed + " " + uvi;

    displayResults.innerHTML = resultString;
}



function getHistory(){
    var result = localStorage.getItem("cities");
    
    if(result != null){
        var parseResult = JSON.parse(result);
        for(var i = 0; i < parseResult.length; i++){
            places.push(parseResult[i]);
        }
    }else{
        console.log("cities not found");
    }
}

function getCords(){
    fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + cityIn + ",+" + stateIn +"&key=AIzaSyAweIP9TjVJjtUjpbZuiu69BBoh9sMPMUc").then(function(response) {
        response.json().then(function(data) {
            //check response status
            //if status is ok 
            if(data.status === 'OK'){
                //currentLat = data.results[0].geometry.location.lat.toFixed(6);
                //currentlng = data.results[0].geometry.location.lng.toFixed(6);
                city = data.results[0].address_components[0].long_name;
            //if satus is not ok
            }else{
                console.log("*ERROR* " + data.status);
            }
            var tempPlace = [];
            var thisPlace = [cityIn, stateIn];
            tempPlace.push(thisPlace);
            localStorage.setItem("last",JSON.stringify(tempPlace));
            getWeather(data.results[0].geometry.location.lat.toFixed(6),data.results[0].geometry.location.lng.toFixed(6));
        });
    });
}

function getWeather(currentLat, currentlng){
    fetch("https://api.openweathermap.org/data/3.0/onecall?lat=" + currentLat + "&lon=" + currentlng + "&units=metric&appid=ec30fe20fd671a00bbcc63e83e68cb73").then(function(response) {
            response.json().then(function(data) {
                //check if we recieved a good result
                if(data.current){
                    //get values from the data object and assign to variables
                    uvi = data.current.uvi;
                    temp = data.current.temp;
                    windSpeed = data.current.wind_speed;
                    humidity = data.current.humidity;
                    currentIcon = data.current.weather[0].icon;

                    displayWeather(data.current.dt);
                    createHistory(data);
                    showFiveDay(data);
                //if we did not get the expexted result
                }else{
                    console.log("*ERROR* Code:" + data.cod + " \n Message: " + data.message);
                }  
        });
    });
}

// converts from UTC to local time stamp
function convertTime(timeStamp){
    var date = new Date(timeStamp*1000);
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    return month.toString() + "/" + day.toString() + "/" + year.toString();
}
// Capitalizes both letters in the state abbreviation
function capitalizeState(string){
    return string[0].toUpperCase() + string.slice(1).toUpperCase();
}

//Capitalizes the first letter of the ciity name
function capitalizeWord(string){
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

function showFiveDay(data){
    //remove existing five day cards
    removeChildren(fiveDay);
    //make new five day cards
    for (var i = 1; i < 6; i++){
    $(fiveDay).append(makeFiveDayCard(data, i));
    }
}
function removeChildren(parent){
    //get all the children of the parent and store them as array
    var currentChildren = parent.children;
        //loop through the currentChildren array  
        $(currentChildren).each(function(){
            //remove each child of the parent
            this.remove();
        });
    }

function makeFiveDayCard(data, index){
    //create a colum
    let colum =  $("<div>")
    //add class values
    $(colum).addClass("fiveDayCol col-4 col-md-3 col-lg-2 col-xl-2 mb-2");
    
    //create a card
    let card = $("<div>");
    //add the class "card" to the card
    $(card).addClass("card fiveDayCard");
    
    //create card header
    let cardHeader = $("<h4>");
    // add class "card-header bg-dark text-light" to cardHeader
    $(cardHeader).addClass("card-header");
    //assign date to cardHeader
    $(cardHeader).text (convertTime(data.daily[index].dt));
    
    //create a div for the icon
    let iconDiv = $("<img>");
    //display icon in iconDiv
    $(iconDiv).attr("src", "icons/"+data.daily[index].weather[0].icon+".png");

    //create text elements for temp wind and humidity
    let tempText = $("<text>");
    let windtext = $("<text>");
    let humidText = $("<text>");

    //display corrisponding values
    $(tempText).text("Temp: " + data.daily[index].temp.max.toString() + " C");
    $(windtext).text("Wind: " + data.daily[index].wind_speed.toString() + " KPH");
    $(humidText).text("Humidity: " + data.daily[index].humidity.toString()+ "%");

    //add header to card
    $(card).append(cardHeader);
    //add iconDiv to card
    $(card).append(iconDiv);
    //add temp wind and humidity to card
    $(card).append(tempText);
    $(card).append(windtext);
    $(card).append(humidText);
    //add card to colum
    $(colum).append(card);
    return colum;
}

console.log(localStorage.getItem("cities"));
getCords();
getHistory();