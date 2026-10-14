const form = document.querySelector(".search-form");
const input = document.querySelector(".search-input");
const temp = document.querySelector("#curr-temp");
const desc = document.querySelector(".description");
const icon = document.querySelector(".weather-icon");

// Add your OpenWeatherMap API key here for local testing.
// Never commit a real key to a public repository.
const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY";

form.addEventListener("submit", (event) => {
  event.preventDefault();
  getWeather(input.value.trim());
});

async function getWeather(city) {
  if (!city) {
    showMessage("Please enter a city name.");
    return;
  }

  if (API_KEY === "YOUR_OPENWEATHERMAP_API_KEY") {
    showMessage("Add your OpenWeatherMap API key in script.js to get started.");
    icon.removeAttribute("src");
    return;
  }

  temp.textContent = "…";
  desc.textContent = "Loading weather…";
  icon.removeAttribute("src");

  try {
    const url = new URL("https://api.openweathermap.org/data/2.5/weather");
    url.search = new URLSearchParams({
      q: city,
      appid: API_KEY,
      units: "metric",
    }).toString();

    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("City not found. Check the spelling and try again.");
      }
      if (response.status === 401) {
        throw new Error("API key is invalid or not active. Check your OpenWeatherMap account.");
      }
      throw new Error("Weather service is unavailable. Please try again.");
    }

    const data = await response.json();
    temp.textContent = `${Math.round(data.main.temp)}°C`;
    desc.textContent = data.weather[0].description;
    icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
    icon.alt = data.weather[0].description;
  } catch (error) {
    showMessage(error.message || "Could not load weather. Please try again.");
    icon.removeAttribute("src");
  }
}

function showMessage(message) {
  temp.textContent = "—";
  desc.textContent = message;
}

// Show a helpful initial state until a city is searched.
getWeather(input.value.trim() || "London");
