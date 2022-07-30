var currentLat;
var currentlng;
var city;
var date;
var currentIcon;
var temp;
var humidity;
var wind_speed;
var uvi;
var cityIn="Peterborough";
var stateIn="Ontario";
var userCity=document.getElementById("cityIn");
var userState=document.getElementById("stateIn");
var displayResults=document.getElementById("displayResults");
var places=[];

//city input form
$("#search").click(function(){
    cityIn = userCity.value;
    stateIn = userState.value;
    var tempArray = [cityIn, stateIn];
    places.push(tempArray);
    //save to local storage
    localStorage.setItem("cities", JSON.stringify(places));
    //retrieve local storage
    function getHistory() {
        var result=localStorage.getItem("cities");
        if (result!=null){
            var parseResult=JSON.parse(result);
                for(var i=0; i>parseResult.length; i++){
                    places.push(parseResult[i]);
                }
        }else{
            console.log("cities not found");
        }
        console.log(places);
    }
    getHistory();
    getCords();
});



//turns search string into lat+long coords
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

//gets response from weather api
function getWeather(){
    fetch("https://api.openweathermap.org/data/3.0/onecall?lat=" + currentLat + "&lon=" + currentlng + "&units=metric&appid=ec30fe20fd671a00bbcc63e83e68cb73").then(function(response) {
            response.json().then(function(data) {
                temp=data.current.temp;
                humidity=data.current.humidity;
                wind_speed=data.current.wind_speed;
                uvi=data.current.uvi;
                currentIcon = data.current.weather[0].icon;
                console.log(temp + " " + humidity + " " + wind_speed + " " + uvi + " " + city);
                console.log(data);
                function displayWeather(){
                    var resultString= city + " " + date + " " +  currentIcon + " "  + temp + " " + humidity + " " + wind_speed + " " + uvi;
                    displayResults.textContent=resultString;
                  }
                displayWeather();
                displayResults.innerHTML="<img src=icons/"+currentIcon+".png>"
            
        });
    });
}

getCords();

