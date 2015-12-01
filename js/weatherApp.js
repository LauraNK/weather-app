var app = angular.module('weatherApp', []);
app.controller('weatherAppCtrl', function($scope, $http) {

  $scope.currentWeather = {};
  $scope.allForecast = [];
  $scope.userLocation = {};

  var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  //Detect location of user
  getLocation = function() {
    $.get("http://ip-api.com/json", function(data) {
      $scope.userLocation.city = data.city;
      $scope.userLocation.region = data.region;
      $scope.userLocation.countryCode = data.countryCode.toLowerCase();
      $scope.$apply();
      getWeather();
    }, 'jsonp');
  };

  getWeather = function() {
    var apiUrl = 'http://api.openweathermap.org/data/2.5/weather?q=' + $scope.userLocation.city + ',' + $scope.userLocation.countryCode + '&APPID=a5bb3d3396a371e54916503720fca1a3';
    console.log(apiUrl);

    // Get current weather
    $.get(apiUrl, function(data) {
      $scope.currentWeather.currentTemp = toCel(data.main.temp);
      $scope.currentWeather.maxTemp = toCel(data.main.temp_max);
      $scope.currentWeather.weather = data.weather[0].description;
      $scope.currentWeather.icon = data.weather[0].icon;
      $scope.$apply();
    });
    getForecast();
  };

  getForecast = function() {
    var forecastUrl = 'http://api.openweathermap.org/data/2.5/forecast?q=' + $scope.userLocation.city + ',' + $scope.userLocation.countryCode + '&APPID=a5bb3d3396a371e54916503720fca1a3';
    console.log(forecastUrl);

    // Get three day forecast
    $.get(forecastUrl, function(data) {

      for (var i = 0; i < 3; i++) {
        
        // Temporary object
        var temp = {};

        var num = i * 8;
        temp.minTemp = toCel(data.list[num].main.temp_min);
        temp.maxTemp = toCel(data.list[num].main.temp_max);
        temp.weather = data.list[num].weather[0].main;
        temp.icon = data.list[num].weather[0].icon;

        $scope.allForecast.push(temp);
        $scope.$apply();
        console.log($scope.allForecast);
        console.log(num);
      };
    });

  };
  
  //Convert to celsius
  function toCel(temperature) {
    temperature = (Math.floor(temperature - 273.15));
    return temperature;
  };

  //Set time
  setInterval(function() {
    var minutes = new Date().getMinutes();
    var hours = new Date().getHours();
    var totalTime = hours + ':' + (minutes < 10 ? "0" : "") + minutes;
    $("#time").html(convert(totalTime));

    //Converts military to standard using moment.js
    function convert(input) {
      return moment(input, 'HH:mm').format('h:mm A');
    }

  }, 1000);

  function getDate() {
      var monthNames = ["Jan.", "Feb.", "March", "April", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];
      var newDate = new Date();
      var day = newDate.getDay();
      var month = newDate.getMonth();
      var date = newDate.getDate();
      $("#date").html(dayNames[day] + " " + monthNames[month] + " " + date);
    };

  getLocation();
  getDate();
});