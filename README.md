# Weather App

A lightweight, responsive weather application built with HTML, CSS, and vanilla JavaScript. Search for a city to view its current temperature, weather condition, and matching weather icon.

## Features

- Search current weather by city name
- Temperature displayed in Celsius
- Weather condition and icon from OpenWeatherMap
- Responsive layout for desktop and mobile
- Basic handling for unknown cities

## Tech Stack

- **HTML5** — page structure
- **CSS3** — styling and responsive layout
- **JavaScript** — form handling and API requests
- **OpenWeatherMap API** — current weather data

## Getting Started

### Prerequisites

- A modern web browser
- An OpenWeatherMap API key

### Run locally

1. Clone the repository:

   ```bash
   git clone https://github.com/anishshaikh1412/weather.git
   cd weather
   ```

2. Configure your API key in `script.js` (see the security note below).
3. Open `index.html` in your browser. If your browser restricts local requests, use a simple local development server.

## Project Structure

```text
weather/
├── index.html   # App markup
├── style.css    # Responsive styles
├── script.js    # Weather API integration
└── README.md    # Project documentation
```

## API Key Security

**Do not publish private API keys in a public repository.** The current client-side implementation has an API key in `script.js`, which can be read by anyone visiting the repository. If the key is yours, revoke or rotate it in your OpenWeatherMap account. For a production deployment, move API requests behind a backend or serverless function and keep secrets in environment variables. A key embedded in browser JavaScript cannot be kept secret.

## Possible Improvements

- Add humidity, wind speed, and feels-like temperature
- Add loading and accessible error states
- Add forecast support
- Add automated tests and deployment workflow

## Author

[anishshaikh1412](https://github.com/anishshaikh1412)

---

If you find this project useful, feel free to star the repository.
