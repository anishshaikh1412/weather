const form = document.querySelector(".search-form");
const input = document.querySelector(".search-input");
const temp = document.querySelector("#curr-temp");
const desc = document.querySelector(".description");
const icon = document.querySelector(".weather-icon");

const API = "66069e1d1c76bc2a9f211029b1cadc13";

form.addEventListener("submit", (e) => {
  e.preventDefault();
  getWeather(input.value.trim());
});

async function getWeather(city) {
  if (!city) return;

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API}&units=metric`
  );
  const data = await res.json();

  if (data.cod !== 200) {
    temp.textContent = "Error";
    desc.textContent = "City not found";
    icon.src = "images/no-result.svg";
    return;
  }

  temp.textContent = data.main.temp + " °C";
  desc.textContent = data.weather[0].description;
  icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
}

// default city from input
getWeather("London");