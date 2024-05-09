const apiKey = "4987701dd0a8ed324f4aa2a79eabd20f";
const form = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const weatherInfo = document.getElementById("weather-info");
const searchHistory = document.getElementById("search-history");
let forecastDays = {};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    getForecast(city);
    cityInput.value = "";
  }
});

function getForecast(city) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
  )
    .then((response) => response.json())
    .then((data) => {
      parseForecast(data);
      displayForecast();
      addToSearchHistory(city);
    })
    .catch((error) => {
      console.log("Error fetching forecast data:", error);
      weatherInfo.innerHTML =
        "<p>Failed to fetch forecast data. Please try again.</p>";
    });
}

function parseForecast(data) {
  forecastDays = {};
  data.list.forEach((forecast) => {
    const date = new Date(forecast.dt * 1000);
    const day = date.toLocaleDateString(undefined, { weekday: "long" });

    if (!forecastDays[day]) {
      forecastDays[day] = {
        date: date.toLocaleDateString(),
        temperature: forecast.main.temp,
        humidity: forecast.main.humidity,
      };
    }
  });
}

function displayForecast() {
  weatherInfo.innerHTML = "";
  Object.values(forecastDays).forEach((dayForecast) => {
    const forecastBox = document.createElement("div");
    forecastBox.classList.add("forecast-box");
    forecastBox.innerHTML = `
            <h3>${dayForecast.date}</h3>
            <p>Temperature: ${dayForecast.temperature}°C</p>
            <p>Humidity: ${dayForecast.humidity}%</p>
        `;
    weatherInfo.appendChild(forecastBox);
  });
}

function addToSearchHistory(city) {
  const listItem = document.createElement("li");
  listItem.textContent = city;
  listItem.addEventListener("click", () => getForecast(city));
  searchHistory.appendChild(listItem);
}
