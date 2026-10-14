
const API_KEY = "72715c936f76dc5c11fe4d82f61cb5e7";

const form = document.querySelector("#weather-form");
const input = document.querySelector("#city-input");
const statusEl = document.querySelector("#status");
const locationName = document.querySelector("#location-name");
const temperature = document.querySelector("#temperature");
const description = document.querySelector("#description");
const weatherIcon = document.querySelector("#weather-icon");
const feelsLike = document.querySelector("#feels-like");
const humidity = document.querySelector("#humidity");
const windSpeed = document.querySelector("#wind-speed");
const forecastList = document.querySelector("#forecast-list");

const CURRENT_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

async function fetchWeather(url) {
  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("API key invalid or not activated.");
    }
    if (response.status === 404) {
      throw new Error("City not found. Check the spelling.");
    }
    throw new Error(`Weather request failed: ${response.status}`);
  }

  return response.json();
}

function makeIconUrl(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

async function getWeather(city) {
  if (!city.trim()) {
    statusEl.textContent = "Please enter a city name.";
    return;
  }

  if (!API_KEY || API_KEY === "YOUR_WORKING_API_KEY") {
    statusEl.textContent = "Please configure your OpenWeatherMap API key.";
    return;
  }

  statusEl.textContent = "Loading weather...";
  forecastList.replaceChildren();

  try {
    const query = `q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

    const [weather, forecast] = await Promise.all([
      fetchWeather(`${CURRENT_URL}?${query}`),
      fetchWeather(`${FORECAST_URL}?${query}`)
    ]);

    locationName.textContent = `${weather.name}, ${weather.sys.country}`;
    temperature.textContent = `${Math.round(weather.main.temp)}°C`;
    description.textContent = weather.weather[0].description;

    weatherIcon.src = makeIconUrl(weather.weather[0].icon);
    weatherIcon.alt = weather.weather[0].description;
    weatherIcon.hidden = false;

    feelsLike.textContent = `${Math.round(weather.main.feels_like)}°C`;
    humidity.textContent = `${weather.main.humidity}%`;
    windSpeed.textContent = `${(weather.wind.speed * 3.6).toFixed(1)} km/h`;

    displayForecast(forecast);
    statusEl.textContent = "";

  } catch (error) {
    console.error("Weather error:", error);
    statusEl.textContent = error.message;
    temperature.textContent = "--°C";
    description.textContent = "Weather unavailable";
    weatherIcon.hidden = true;
    forecastList.textContent = "Forecast unavailable.";
  }
}

function displayForecast(data) {
  forecastList.replaceChildren();

  const daily = new Map();

  data.list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    const hour = Number(item.dt_txt.slice(11, 13));
    const previous = daily.get(date);

    if (
      !previous ||
      Math.abs(hour - 12) <
        Math.abs(Number(previous.dt_txt.slice(11, 13)) - 12)
    ) {
      daily.set(date, item);
    }
  });

  [...daily.values()].slice(0, 5).forEach((item) => {
    const card = document.createElement("article");
    card.className = "forecast-card";

    const date = document.createElement("p");
    date.className = "forecast-date";
    date.textContent = new Date(item.dt * 1000).toLocaleDateString(
      "en-IN",
      { weekday: "short", day: "numeric", month: "short" }
    );

    const icon = document.createElement("img");
    icon.src = makeIconUrl(item.weather[0].icon);
    icon.alt = item.weather[0].description;
    icon.width = 64;
    icon.height = 64;

    const temp = document.createElement("strong");
    temp.textContent = `${Math.round(item.main.temp)}°C`;

    const desc = document.createElement("p");
    desc.textContent = item.weather[0].description;

    card.append(date, icon, temp, desc);
    forecastList.appendChild(card);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  getWeather(input.value.trim());
});

getWeather(input.value.trim() || "Anand");
