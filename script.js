var weatherApiKey ='da8c5a6540ac11ba3df901df43f83982';
var weatherDirectUrl = 'https://api.openweathermap.org/geo/1.0/direct';
var weatherGeoUrl = 'https://api.openweathermap.org/data/2.5/onecall'
var searchHistoryArr = [];
var formInputEl = document.querySelector('#form-input');
var searchFormEl = document.querySelector('#search-form')
var today = moment().format("MMM Do, YYYY");
var searchHistoryEL = document.querySelector('#search-history')



var formSubmitHandler = function (event) {
    event.preventDefault();
  
    var search = formInputEl.value.trim();
  
    if (search) {
      getGeoLocation(search);
  
    } else {
      alert('Please enter a City');
    }
  };

  var getGeoLocation = function (search) {
    var apiUrl = `${weatherDirectUrl}?q=${search}&limit=5&appid=${weatherApiKey}&limit=1`;
  
    fetch(apiUrl)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            fetchWeatherData(data[0]);
            setHistory(search)

          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to Weather Service');
      });
  };

  function fetchWeatherData (city){
      var lat = city.lat
      var lon = city.lon
      var name = city.name

      var apiUrl = `${weatherGeoUrl}?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&exclude=minutely,%20hourly&units=imperial`

      fetch(apiUrl)
      .then(function(response){
          response.json().then(function (data){
              renderWeather(name, data)
              renderForecast(data.daily)
          })
      })
  }
  
  function renderWeather (name, data) {
      var curentTemp = data.current.temp
      var wind = data.current.wind_speed
      var humidity = data.current.humidity
      var uvIndex = data.current.uvi
      var weather = data.current.weather
      var icon = weather[0].icon


    $('.today').html(
        `<div class="today-new">
        <h2>${name} ${today} <img src='http://openweathermap.org/img/wn/${icon}@2x.png'></h2>
        <p>Current temp: ${curentTemp}</p>
        <p>Wind: ${wind}</p>
        <p>Humidity: ${humidity}</p>
        <p>UV Index: <button class="button is-small"> ${uvIndex}</button>
        </div>`);

            if (uvIndex < 3) {
                $('.is-small').addClass("is-success");
              } else if (uvIndex > 7) {
                $('.is-small').addClass("is-danger");
              } else {
                $('.is-small').addClass("is-warning");
              }

  }

  function renderForecast(forecast) {

    $('.forecast').empty()

      $.each(forecast, function(i, forecast) {

        if (i==0){
            return ;
      }

        if (i == 6) {
            return false;
      }

          $('.forecast').append(
              `<div class="column card">
              <p>${moment.unix(forecast.dt).format("MM/DD/YYYY")}</p>
              <img src='http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png'>
              <p>Temp: ${forecast.temp.day}</p>
              <p>Wind: ${forecast.wind_speed}</p>
              <p>Humidity: ${forecast.humidity}</p>
              </div>`
          )
      })

  }



  function renderSearches() {
    $(searchHistoryEL).empty();
    $(searchHistoryArr).each(function (i, searchHistory) {
      $(searchHistoryEL).append(`
          <button class="button btn-history is-fullwidth mt-2" data-search="${searchHistory}">${searchHistory}</button>
          `)
    });
  
  }


  function initSearchHistory(){
    var storedHistory = localStorage.getItem('search-history');
    if(storedHistory){
       searchHistoryArr = JSON.parse(storedHistory);
    }
    renderSearches()
  }

  initSearchHistory();

  function setHistory(search) {
    if (searchHistoryArr.indexOf(search) !== -1) {
      return;
    }
    searchHistoryArr.push(search);
    localStorage.setItem('search-history', JSON.stringify(searchHistoryArr));
    renderSearches();
  }



  $('.btn-history').on('click', function() {
    var redo = $(this).attr("data-search") 
    console.log(redo)
    getGeoLocation(redo)
  });

renderSearches();
 searchFormEl.addEventListener('submit', formSubmitHandler);


