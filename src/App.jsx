import React, { useState, useEffect } from "react";
import "./App.css";

const API_KEY = "6d85ccb11f53edd212a766688caea647";

const WEATHER_ICONS = {
  Clear:       "☀️",
  Clouds:      "☁️",
  Rain:        "🌧️",
  Drizzle:     "🌦️",
  Snow:        "❄️",
  Thunderstorm:"⛈️",
  Mist:        "🌫️",
  Fog:         "🌫️",
  Haze:        "🌫️",
};

const CONDITION_THEME = {
  Clear:        "theme-clear",
  Clouds:       "theme-clouds",
  Rain:         "theme-rain",
  Drizzle:      "theme-rain",
  Snow:         "theme-snow",
  Thunderstorm: "theme-storm",
  Mist:         "theme-mist",
  Fog:          "theme-mist",
  Haze:         "theme-mist",
};

function formatTime(unix) {
  return new Date(unix * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("theme-clear");

  const fetchWeather = async (cityName) => {
    if (!cityName.trim()) return;
    setLoading(true);
    setError("");
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&units=metric&appid=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod !== 200) {
        setError(`City "${cityName}" not found. Try another name.`);
        setWeatherData(null);
        setLoading(false);
        return;
      }

      const condition = data.weather[0].main;
      setTheme(CONDITION_THEME[condition] || "theme-clear");

      setWeatherData({
        city: data.name,
        country: data.sys.country,
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        tempMin: Math.round(data.main.temp_min),
        tempMax: Math.round(data.main.temp_max),
        humidity: data.main.humidity,
        wind: data.wind.speed,
        pressure: data.main.pressure,
        visibility: (data.visibility / 1000).toFixed(1),
        sunrise: formatTime(data.sys.sunrise),
        sunset: formatTime(data.sys.sunset),
        condition: data.weather[0].main,
        description: data.weather[0].description
          .split(" ")
          .map((w) => w[0].toUpperCase() + w.slice(1))
          .join(" "),
        icon: WEATHER_ICONS[condition] || "🌡️",
      });
    } catch {
      setError("Network error. Please check your connection.");
      setWeatherData(null);
    }
    setLoading(false);
  };

  // Auto-load Salem on mount
  useEffect(() => {
    fetchWeather("Salem");
  }, []);

  const handleSearch = () => {
    if (city.trim()) fetchWeather(city.trim());
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className={`app ${theme}`}>
      {/* Aurora blobs */}
      <div className="aurora aurora-1" />
      <div className="aurora aurora-2" />
      <div className="aurora aurora-3" />

      <div className="weather-card">
        {/* Search */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search city…"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKey}
          />
          <button onClick={handleSearch} aria-label="Search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="error-msg">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="loading">
            <div className="spinner" />
          </div>
        )}

        {/* Weather Content */}
        {!loading && weatherData && (
          <div className="weather-content">
            {/* Hero */}
            <div className="weather-hero">
              <div className="hero-top">
                <div className="location">
                  <span className="city-name">{weatherData.city}</span>
                  <span className="country-badge">{weatherData.country}</span>
                </div>
                <div className="condition-pill">{weatherData.description}</div>
              </div>

              <div className="hero-main">
                <div className="weather-emoji">{weatherData.icon}</div>
                <div className="temp-block">
                  <span className="temp-main">{weatherData.temperature}</span>
                  <span className="temp-unit">°C</span>
                </div>
              </div>

              <div className="temp-range">
                <span>↑ {weatherData.tempMax}°</span>
                <span className="feels">Feels {weatherData.feelsLike}°</span>
                <span>↓ {weatherData.tempMin}°</span>
              </div>
            </div>

            {/* Divider */}
            <div className="divider" />

            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-icon">💧</span>
                <div className="stat-data">
                  <span className="stat-value">{weatherData.humidity}%</span>
                  <span className="stat-label">Humidity</span>
                </div>
              </div>

              <div className="stat-card">
                <span className="stat-icon">🌬️</span>
                <div className="stat-data">
                  <span className="stat-value">{weatherData.wind} m/s</span>
                  <span className="stat-label">Wind</span>
                </div>
              </div>

              <div className="stat-card">
                <span className="stat-icon">📊</span>
                <div className="stat-data">
                  <span className="stat-value">{weatherData.pressure}</span>
                  <span className="stat-label">hPa</span>
                </div>
              </div>

              <div className="stat-card">
                <span className="stat-icon">👁️</span>
                <div className="stat-data">
                  <span className="stat-value">{weatherData.visibility} km</span>
                  <span className="stat-label">Visibility</span>
                </div>
              </div>

              <div className="stat-card">
                <span className="stat-icon">🌅</span>
                <div className="stat-data">
                  <span className="stat-value">{weatherData.sunrise}</span>
                  <span className="stat-label">Sunrise</span>
                </div>
              </div>

              <div className="stat-card">
                <span className="stat-icon">🌇</span>
                <div className="stat-data">
                  <span className="stat-value">{weatherData.sunset}</span>
                  <span className="stat-label">Sunset</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
