function updateTimestamp(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let weekday = date.getDay();
  let weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return `${weekdays[weekday]} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000 + 86400000);
  let day = date.getDay();
  let weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return weekdays[day];
}

function handleErrors() {
  alert("No matches!");
}

function search(city) {
  let apiKey = "d4e08a0b9b2ea184fab7dbd303ce7427";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  fetch(apiUrl).then(function (response) {
    if (!response.ok) {
      handleErrors();
    } else {
      axios.get(apiUrl).then(updateLocationAndWeatherConditions);
    }
  });
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  if (city.length > 0) {
    search(city);
  } else {
    alert("Please enter a city");
  }
}

function getForecast(coordinates) {
  let apiKey = "d4e08a0b9b2ea184fab7dbd303ce7427";
  let apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function updateLocationAndWeatherConditions(response) {
  document.querySelector(
    "#city-country"
  ).innerHTML = `${response.data.name}, ${response.data.sys.country}`;

  celsiusTemp = response.data.main.temp;
  document.querySelector("#current-temperature").innerHTML = `${Math.round(
    celsiusTemp
  )}°`;

  feelsLike = response.data.main.feels_like;
  document.querySelector("#feels-like").innerHTML = `feels like ${Math.round(
    feelsLike
  )}°`;

  document.querySelector("#sky").innerHTML =
    response.data.weather[0].description;

  // wind speed from m/s into km/h
  let windSpeed = response.data.wind.speed * 3.6;
  document.querySelector("#wind-speed").innerHTML = `wind: ${Math.round(
    windSpeed
  )} km/h`;

  minTemperatureCelsius = response.data.main.temp_min;
  maxTemperatureCelsius = response.data.main.temp_max;
  document.querySelector("#min-max").innerHTML = `${Math.round(
    minTemperatureCelsius
  )}°/${Math.round(maxTemperatureCelsius)}°`;

  //update timestamp
  let currentDateAndTime = document.querySelector("#current-date");
  currentDateAndTime.innerHTML = updateTimestamp(response.data.dt * 1000);

  // update weather icon
  let mainIcon = document.querySelector("#main-icon");
  let iconCode = response.data.weather[0].icon;
  mainIcon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${iconCode}@2x.png`
  );
  mainIcon.setAttribute("alt", response.data.weather[0].description);

  // Celsius link is .active on load
  celsiusTriggerClick.classList.add("active");
  fahrenheitTriggerClick.classList.remove("active");

  getForecast(response.data.coord);
}

function locate(location) {
  navigator.geolocation.getCurrentPosition(findUser);
}

function findUser(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiKey = "d4e08a0b9b2ea184fab7dbd303ce7427";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(updateLocationAndWeatherConditions);
}

function displayForecast(response) {
  forecast = response.data.daily;
  let forecastElement = document.querySelector("#weekly-forecast");
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `<div class="col weekly-forecast">
          <div>${formatDay(forecastDay.dt)}<br />${Math.round(
          forecastDay.temp.min
        )}°/<strong>${Math.round(forecastDay.temp.max)}°</strong><br />
            <img
              class="forecast-icon"
              src="https://openweathermap.org/img/wn/${
                forecastDay.weather[0].icon
              }@2x.png"
            />
          </div>`;
      forecastHTML = forecastHTML + `</div>`;
      forecastElement.innerHTML = forecastHTML;

      minTemperatureCelsiusForecast = forecastDay.temp.min;
      maxTemperatureCelsiusForecast = forecastDay.temp.max;
    }
  });
}

function convertToFahrenheit(event) {
  let fahrenheitTemp = (celsiusTemp * 9) / 5 + 32;
  let currentTemperature = document.querySelector("#current-temperature");
  currentTemperature.innerHTML = `${Math.round(fahrenheitTemp)}°`;

  // remove .active from Celsius link and add .active to Fahrenheit link
  celsiusTriggerClick.classList.remove("active");
  fahrenheitTriggerClick.classList.add("active");

  document.querySelector("#feels-like").innerHTML = `feels like ${Math.round(
    (feelsLike * 9) / 5 + 32
  )}°`;

  // convert min/max temperatures
  let minTemperatureFahrenheit = (minTemperatureCelsius * 9) / 5 + 32;
  let maxTemperatureFahrenheit = (maxTemperatureCelsius * 9) / 5 + 32;
  document.querySelector("#min-max").innerHTML = `${Math.round(
    minTemperatureFahrenheit
  )}°/${Math.round(maxTemperatureFahrenheit)}°`;
}

function convertToCelsius(event) {
  let currentTemperature = document.querySelector("#current-temperature");
  currentTemperature.innerHTML = `${Math.round(celsiusTemp)}°`;

  // remove .active from Fahrenheit link and add .active to Celsius link
  fahrenheitTriggerClick.classList.remove("active");
  celsiusTriggerClick.classList.add("active");

  document.querySelector("#feels-like").innerHTML = `feels like ${Math.round(
    feelsLike
  )}°`;

  document.querySelector("#min-max").innerHTML = `${Math.round(
    minTemperatureCelsius
  )}°/${Math.round(maxTemperatureCelsius)}°`;
}

let locationSearch = document.querySelector("form");
locationSearch.addEventListener("submit", handleSubmit);

let locationButton = document.querySelector("#location-icon");
locationButton.addEventListener("click", locate);

let fahrenheitTriggerClick = document.querySelector("#fahrenheit-link");
fahrenheitTriggerClick.addEventListener("click", convertToFahrenheit);

let celsiusTriggerClick = document.querySelector("#celsius-link");
celsiusTriggerClick.addEventListener("click", convertToCelsius);

let celsiusTemp = null;
let feelsLike = null;
let minTemperatureCelsius = null;
let maxTemperatureCelsius = null;

search("Berlin");
