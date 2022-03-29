function updateTimestamp(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  // ("0" + now.getHours()).slice(-2)
  let minutes = date.getMinutes();
  // ("0" + now.getMinutes()).slice(-2);
  let weekday = date.getDay();
  let weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return `${weekdays[weekday]} ${hours}:${minutes}`;
}

function search(city) {
  let apiKey = "d4e08a0b9b2ea184fab7dbd303ce7427";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(updateLocationAndWeatherConditions);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  search(city);
}

function updateLocationAndWeatherConditions(response) {
  document.querySelector(
    "#city-country"
  ).innerHTML = `${response.data.name}, ${response.data.sys.country}`;
  document.querySelector("#current-temperature").innerHTML = `${Math.round(
    response.data.main.temp
  )}°`;
  document.querySelector("#feels-like").innerHTML = `feels like ${Math.round(
    response.data.main.feels_like
  )}°`;
  document.querySelector("#sky").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#min-max").innerHTML = `${Math.round(
    response.data.main.temp_min
  )}°/${Math.round(response.data.main.temp_max)}°`;

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

let locationSearch = document.querySelector("form");
locationSearch.addEventListener("submit", handleSubmit);

let locationButton = document.querySelector("#location-icon");
locationButton.addEventListener("click", locate);

search("Berlin");

// function changeToFahrenheit() {
//   let fahrenheitTemp = `50°F`;
//   let currentTemperature = document.querySelector("#current-temperature");
//   currentTemperature.innerHTML = `${fahrenheitTemp}`;
// }
// let fahrenheitTriggerClick = document.querySelector("#fahrenheit");
// fahrenheitTriggerClick.addEventListener("click", changeToFahrenheit);

// function changeToCelsius() {
//   let celsiusTemp = `10°C`;
//   let currentTemperature = document.querySelector("#current-temperature");
//   currentTemperature.innerHTML = `${celsiusTemp}`;
// }
// let celsiusTriggerClick = document.querySelector("#celsius");
// celsiusTriggerClick.addEventListener("click", changeToCelsius);
