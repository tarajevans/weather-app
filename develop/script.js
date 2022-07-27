var currentLat;
var currentlng;
var city;
var date;
var icon;
var temp;
var humidity;
var wind_speed;
var uvi;
var cityIn="Peterborough";
var stateIn="Ontario";
var userCity=document.getElementById("cityIn");
var userState=document.getElementById("stateIn");
var places=[];


$("#search").click(function(){
    cityIn = userCity.value;
    stateIn = userState.value;
    var tempArray = [cityIn, stateIn];
    places.push(tempArray);
    
    localStorage.setItem("cities", JSON.stringify(places));
});


function getCords(){
    fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + cityIn + ", + " + stateIn + "&key=AIzaSyAweIP9TjVJjtUjpbZuiu69BBoh9sMPMUc").then(function(response) {
        response.json().then(function(data) {
            console.log(data.results[0].geometry.location.lat)
            currentLat = data.results[0].geometry.location.lat.toFixed(6);
            currentlng = data.results[0].geometry.location.lng.toFixed(6);
            city = data.results[0].address_components[0].long_name;
            getWeather();
        });
    });
}

function getWeather(){
    fetch("https://api.openweathermap.org/data/3.0/onecall?lat=" + currentLat + "&lon=" + currentlng + "&units=metric&appid=ec30fe20fd671a00bbcc63e83e68cb73").then(function(response) {
            response.json().then(function(data) {
                temp=data.current.temp;
                humidity=data.current.humidity;
                wind_speed=data.current.wind_speed;
                uvi=data.current.uvi;
                console.log(temp + " " + humidity + " " + wind_speed + " " + uvi + " " + city);
                console.log(data);
            
        });
    });
}

getCords();