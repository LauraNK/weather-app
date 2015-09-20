$(document).ready(function() {

  //Global scopes to store variables
  var myScope = {};
  var myUrl = {};

  function getDate() {
      var monthNames = ["Jan.", "Feb.", "March", "April", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];
      var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      var newDate = new Date();
      var day = newDate.getDay();
      var month = newDate.getMonth();
      var date = newDate.getDate();
      $("#date").html(dayNames[day] + " " + monthNames[month] + " " + date);
      myScope.thisDay = dayNames[day];
    } //End getDate

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

  getInfo = function() {
    $.get("http://ipinfo.io", function(result) {
      myScope.city = result.city;
      myScope.region = result.region;
      myScope.country = result.country.toLowerCase();
      $('#location').html(myScope.city);
      myUrl.apiUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + myScope.city + "," + myScope.country;
      console.log(myUrl);
      getWeather();
      getForecast();
    }, "jsonp");

  };

  getWeather = function() {

    $.get(myUrl.apiUrl, function(data) {
      function setCel() {
          $('#currentTemp').html(Math.floor((data.main.temp - 273.15)) + '&#176C');
          $('#maxTemp').html(Math.floor((data.main.temp_max - 273.15)) + '&#176C');
        }
        //Convert to Fahr 
      $('#fahr').click(function() {
        $('#currentTemp').html(Math.floor((data.main.temp - 273.15) * 1.8000 + 32.00) + '&#176F');
        $('#maxTemp').html(Math.floor((data.main.temp_max - 273.15) * 1.8000 + 32.00) + '&#176F');
      });

      $('#cel').click(function() {
        setCel();
      });
      setCel();
      $('#weather').html(data.weather[0].description);
      $('#icon').append("<img src='http://openweathermap.org/img/w/" + data.weather[0].icon + ".png'>");

    }, "jsonp");
  };

  getForecast = function() {
    var forecastUrl = "http://api.openweathermap.org/data/2.5/forecast?q=" + myScope.city + "," + myScope.country;
    console.log(forecastUrl);
    $.get(forecastUrl, function(data) {

      var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

      var newDate = new Date();

      var tomorrow = newDate.getDay() + 1;
      var secondDay = newDate.getDay() + 2;
      var thirdDay = newDate.getDay() + 3;
      //If end of week, reset
      if (tomorrow === 7) {
        tomorrow = 0;
      }
      if (secondDay === 7) {
        secondDay = 0;
      } else if (secondDay === 8) {
        secondDay = 1;
      }
      if (thirdDay === 7) {
        thirdDay = 0;
      } else if (thirdDay === 8) {
        thirdDay = 1;
      } else if (thirdDay === 9) {
        thirdDay = 2;
      }

      $('#tomorrow h3').html(dayNames[tomorrow]);
      $('#tomorrow .icon').append("<img src='http://openweathermap.org/img/w/" + data.list[0].weather[0].icon + ".png'>");
      $('#tomorrow .weatherDisplay').html(data.list[0].weather[0].main);
      $('.tempDisplay2 .min1').html(Math.floor(data.list[0].main.temp_min - 273.15) + '&#176C');
      $('.tempDisplay2 .max1').html(Math.floor(data.list[0].main.temp_max - 273.15) + '&#176C');

      $('#secondDay h3').html(dayNames[secondDay]);
      $('#secondDay .icon').append("<img src='http://openweathermap.org/img/w/" + data.list[8].weather[0].icon + ".png'>");
      $('#secondDay .weatherDisplay').html(data.list[8].weather[0].main);
      $('.tempDisplay2 .min2').html(Math.floor(data.list[8].main.temp_min - 273.15) + '&#176C');
      $('.tempDisplay2 .max2').html(Math.floor(data.list[8].main.temp_max - 273.15) + '&#176C');

      $('#thirdDay .weatherDisplay').html(data.list[16].weather[0].main);

      $('#thirdDay h3').html(dayNames[thirdDay]);
      $('#thirdDay .icon').append("<img src='http://openweathermap.org/img/w/" + data.list[16].weather[0].icon + ".png'>");
      $('.tempDisplay2 .min3').html(Math.floor(data.list[16].main.temp_min - 273.15) + '&#176C');
      $('.tempDisplay2 .max3').html(Math.floor(data.list[16].main.temp_max - 273.15) + '&#176C');

    }, "jsonp");
  };

  getDate();
  getInfo();
});