const form = document.querySelector(".search-form");
const input = document.querySelector(".search-input");
const temp = document.querySelector("#curr-temp");
const desc = document.querySelector(".description");
const icon = document.querySelector(".weather-icon");
const statusMessage = document.querySelector(".status-message");
const locationName = document.querySelector("#location-name");
const feelsLike = document.querySelector("#feels-like");
const humidity = document.querySelector("#humidity");
const windSpeed = document.querySelector("#wind-speed");
const forecastList = document.querySelector("#forecast-list");

// Paste your OpenWeatherMap API key between the quotes.
// For a public/production website, use a backend proxy: browser keys are visible.
const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY";

form.addEventListener("submit", (event) => {
  event.preventDefault();
  getWeather(input.value.trim());
});

function makeApiUrl(endpoint, params) {
  const url = new URL(`https://api.openweathermap.org/data/2.5/${endpoint}`);
  url.search = new URLSearchParams({ ...params, appid: API_KEY, units: "metric" }).toString();
  return url;
}

async function fetchWeather(endpoint, params) {
  const response = await fetch(makeApiUrl(endpoint, params));
  if (!response.ok) {
    if (response.status === 404) throw new Error("City not found. Please check the spelling.");
    if (response.status === 401) throw new Error("API key is invalid or not active yet. Check your key and account.");
    if (response.status === 429) throw new Error("API request limit reached. Please try again later.");
    throw new Error("Weather service is unavailable. Please try again.");
  }
  return response.json();
}

async function getWeather(city) {
  if (!city) {
    statusMessage.textContent = "Please enter a city name.";
    return;
  }
  if (API_KEY === "YOUR_OPENWEATHERMAP_API_KEY" || !API_KEY.trim()) {
    statusMessage.textContent = "Add your OpenWeatherMap API key in script.js to load weather.";
    return;
  }

  statusMessage.textContent = "";
  temp.textContent = "…";
  desc.textContent = "Loading current weather…";
  forecastList.innerHTML = '<p class="forecast-placeholder">Loading forecast…</p>';

  try {
    const [current, forecast] = await Promise.all([
      fetchWeather("weather", { q: city }),
      fetchWeather("forecast", { q: city }),
    ]);

    locationName.textContent = `${current.name}, ${current.sys.country}`;
    temp.textContent = `${Math.round(current.main.temp)}°C`;
    desc.textContent = current.weather[0].description;
    icon.src = `https://openweathermap.org/img/wn/${current.weather[0].icon}@4x.png`;
    icon.alt = current.weather[0].description;
    feelsLike.textContent = `${Math.round(current.main.feels_like)}°C`;
    humidity.textContent = `${current.main.humidity}%`;
    windSpeed.textContent = `${(current.wind.speed * 3.6).toFixed(1)} km/h`;
    renderForecast(forecast.list);
    statusMessage.textContent = "";
  } catch (error) {
    statusMessage.textContent = error.message || "Could not load weather. Please try again.";
    temp.textContent = "—";
    desc.textContent = "Weather unavailable";
    icon.removeAttribute("src");
    feelsLike.textContent = "—";
    humidity.textContent = "—";
    windSpeed.textContent = "—";
    forecastList.innerHTML = '<p class="forecast-placeholder">Forecast unavailable right now.</p>';
  }
}

function renderForecast(items) {
  // OpenWeatherMap provides 3-hour intervals. Pick the entry closest to midday
  // for each of the next five calendar days in the city's local time.
  const byDay = new Map();
  for (const item of items) {
    const date = new Date(item.dt * 1000);
    const key = date.toISOString().slice(0, 10);
    const hour = date.getUTCHours();
    const score = Math.abs(hour - 12);
    const existing = byDay.get(key);
    if (!existing || score < existing.score) byDay.set(key, { item, score });
  }

  const days = [...byDay.values()].slice(1, 6);
  if (!days.length) {
    forecastList.innerHTML = '<p class="forecast-placeholder">No forecast data available.</p>';
    return;
  }

  forecastList.replaceChildren();
  for (const { item } of days) {
    const date = new Date(item.dt * 1000);
    const day = date.toLocaleDateString(undefined, { weekday: "short", timeZone: "UTC" });
    const description = item.weather[0].description;
    const row = document.createElement("article");
    row.className = "forecast-row";

    const dayLabel = document.createElement("p");
    dayLabel.className = "forecast-day";
    dayLabel.textContent = day;

    const weatherIcon = document.createElement("img");
    weatherIcon.className = "forecast-icon";
    weatherIcon.src = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;
    weatherIcon.alt = description;

    const condition = document.createElement("p");
    condition.className = "forecast-description";
    condition.textContent = description;

    const temperatures = document.createElement("p");
    temperatures.className = "forecast-temps";
    temperatures.textContent = `${Math.round(item.main.temp_max)}°`;
    const low = document.createElement("span");
    low.textContent = `${Math.round(item.main.temp_min)}°`;
    temperatures.appendChild(low);

    row.append(dayLabel, weatherIcon, condition, temperatures);
    forecastList.appendChild(row);
  }
}

// Initial state is intentionally informative until a key is configured.
getWeather(input.value.trim() || "Anand");
