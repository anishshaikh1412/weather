
const API_KEY = "72715c936f76dc5c11fe4d82f61cb5e7";

// Form and input
const form = document.querySelector("form");
const input = document.querySelector("input");

// Weather details
const locationName = document.querySelector("#location-name");
const feelsLike = document.querySelector("#feels-like");
const humidity = document.querySelector("#humidity");
const windSpeed = document.querySelector("#wind-speed");
const forecastList = document.querySelector("#forecast-list");

// Find the main weather display elements
const temperature =
  document.querySelector("#temperature") ||
  document.querySelector("#temp");

const description =
  document.querySelector("#description") ||
  document.querySelector("#weather-description");

const weatherIcon =
  document.querySelector("#weather-icon");

const currentConditions =
  document.querySelector("#current-conditions");

// API endpoints
const CURRENT_WEATHER_URL =
  "https://api.openweathermap.org/data/2.5/weather";

const FORECAST_URL =
  "https://api.openweathermap.org/data/2.5/forecast";

// Show messages on the page
function showMessage(message) {
  if (currentConditions) {
    currentConditions.textContent = message;
  } else if (locationName) {
    locationName.textContent = message;
  } else {
    alert(message);
  }
}

// Fetch weather data
async function fetchWeather(url) {
  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(
        "API key invalid or not activated. Check your OpenWeatherMap API key."
      );
    }

    if (response.status === 404) {
      throw new Error("City not found. Please check the city name.");
    }

    if (response.status === 429) {
      throw new Error("API request limit reached. Try again later.");
    }

    throw new Error(`Weather request failed (${response.status}).`);
  }

  return response.json();
}

// Search and display weather
async function getWeather(city) {
  if (!city.trim()) {
    showMessage("Please enter a city name.");
    return;
  }

  if (
    !API_KEY ||
    API_KEY === "YOUR_OPENWEATHERMAP_API_KEY"
  ) {
    showMessage("Please configure your OpenWeatherMap API key.");
    return;
  }

  showMessage("Loading weather...");

  if (forecastList) {
    forecastList.textContent = "Loading forecast...";
  }

  try {
    const currentUrl =
      `${CURRENT_WEATHER_URL}?q=${encodeURIComponent(city)}` +
      `&appid=${API_KEY}&units=metric`;

    const forecastUrl =
      `${FORECAST_URL}?q=${encodeURIComponent(city)}` +
      `&appid=${API_KEY}&units=metric`;

    const [weather, forecast] = await Promise.all([
      fetchWeather(currentUrl),
      fetchWeather(forecastUrl)
    ]);

    displayWeather(weather);
    displayForecast(forecast);

  } catch (error) {
    console.error("Weather error:", error);
    showMessage(error.message);

    if (forecastList) {
      forecastList.textContent = "Forecast unavailable.";
    }
  }
}

// Display current conditions
function displayWeather(data) {
  if (locationName) {
    locationName.textContent =
      `${data.name}, ${data.sys.country}`;
  }

  if (temperature) {
    temperature.textContent =
      `${Math.round(data.main.temp)}°C`;
  }

  if (description) {
    description.textContent =
      data.weather[0].description;
  }

  if (weatherIcon) {
    weatherIcon.src =
      `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    weatherIcon.alt = data.weather[0].description;
    weatherIcon.hidden = false;
  }

  if (feelsLike) {
    feelsLike.textContent =
      `${Math.round(data.main.feels_like)}°C`;
  }

  if (humidity) {
    humidity.textContent =
      `${data.main.humidity}%`;
  }

  if (windSpeed) {
    windSpeed.textContent =
      `${(data.wind.speed * 3.6).toFixed(1)} km/h`;
  }

  if (currentConditions) {
    currentConditions.textContent =
      data.weather[0].description;
  }
}

// Display one forecast item per day
function displayForecast(data) {
  if (!forecastList) return;

  forecastList.replaceChildren();

  const dailyForecasts = new Map();

  data.list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];

    // Prefer forecasts around midday
    const hour = Number(item.dt_txt.slice(11, 13));
    const existing = dailyForecasts.get(date);

    if (
      !existing ||
      Math.abs(hour - 12) <
        Math.abs(Number(existing.dt_txt.slice(11, 13)) - 12)
    ) {
      dailyForecasts.set(date, item);
    }
  });

  const days = Array.from(dailyForecasts.values()).slice(0, 5);

  days.forEach((day) => {
    const card = document.createElement("div");
    card.className = "forecast-card";

    const date = new Date(day.dt * 1000);

    const dayName = date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short"
    });

    const icon = document.createElement("img");
    icon.src =
      `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
    icon.alt = day.weather[0].description;

    const dateText = document.createElement("p");
    dateText.textContent = dayName;

    const tempText = document.createElement("strong");
    tempText.textContent =
      `${Math.round(day.main.temp)}°C`;

    const descriptionText = document.createElement("p");
    descriptionText.textContent =
      day.weather[0].description;

    card.append(dateText, icon, tempText, descriptionText);
    forecastList.appendChild(card);
  });
}

// Handle search form
if (form && input) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    getWeather(input.value.trim());
  });
} else {
  console.error(
    "Search form or input not found. Check index.html."
  );
}

// Initial city
if (input && input.value.trim()) {
  getWeather(input.value.trim());
}
