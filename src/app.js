function showCurrentTime() {
  let now = new Date();
  let hour = ("0" + now.getHours()).slice(-2);
  let minutes = ("0" + now.getMinutes()).slice(-2);
  let currentTime = document.querySelector("#time");
  currentTime.innerHTML = `${hour}:${minutes}`;
}

function showCurrentDate() {
  let now = new Date();
  let weekday = now.getDay();
  let weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let month = now.getMonth();
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let currentDate = document.querySelector("#current-date");
  currentDate.innerHTML = `${weekdays[weekday]} ${now.getDate()} ${
    months[month]
  }`;
}

showCurrentDate();
showCurrentTime();

function search(city) {
  let apiKey = "d4e08a0b9b2ea184fab7dbd303ce7427";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(updateLocationAndWeatherConditions);
}

function handleSubmit(event) {
  debugger;
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
