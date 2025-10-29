import { useState } from "react";
import axios from "axios";
import {
  WiDaySunny,
  WiDayCloudy,
  WiCloud,
  WiFog,
  WiRain,
  WiShowers,
  WiThunderstorm,
  WiSnow,
  WiNightAltThunderstorm,
} from "react-icons/wi";

// 🎨 Weather mappings: icon + gradient + card color
const weatherStyles = {
  0:  { icon: <WiDaySunny className="text-yellow-300" />, label: "Clear sky", bg: "from-sky-400 via-blue-500 to-indigo-600", card: "bg-white/80 text-gray-800" },
  1:  { icon: <WiDayCloudy className="text-yellow-200" />, label: "Mainly clear", bg: "from-blue-400 via-sky-500 to-indigo-600", card: "bg-white/80 text-gray-800" },
  2:  { icon: <WiDayCloudy className="text-gray-300" />, label: "Partly cloudy", bg: "from-gray-300 via-blue-400 to-indigo-500", card: "bg-white/80 text-gray-800" },
  3:  { icon: <WiCloud className="text-gray-400" />, label: "Overcast", bg: "from-gray-400 via-gray-500 to-gray-700", card: "bg-gray-200/70 text-gray-800" },
  45: { icon: <WiFog className="text-gray-300" />, label: "Fog", bg: "from-gray-300 via-gray-400 to-gray-500", card: "bg-gray-300/70 text-gray-700" },
  48: { icon: <WiFog className="text-gray-300" />, label: "Rime fog", bg: "from-gray-300 via-gray-400 to-gray-600", card: "bg-gray-300/70 text-gray-700" },
  51: { icon: <WiShowers className="text-blue-400" />, label: "Light drizzle", bg: "from-blue-400 via-blue-500 to-indigo-700", card: "bg-blue-100/80 text-gray-800" },
  53: { icon: <WiShowers className="text-blue-400" />, label: "Moderate drizzle", bg: "from-blue-500 via-indigo-500 to-indigo-700", card: "bg-blue-100/80 text-gray-800" },
  55: { icon: <WiRain className="text-blue-500" />, label: "Dense drizzle", bg: "from-slate-500 via-blue-600 to-sky-800", card: "bg-slate-200/80 text-gray-800" },
  61: { icon: <WiRain className="text-blue-400" />, label: "Slight rain", bg: "from-blue-400 via-blue-600 to-indigo-700", card: "bg-blue-100/80 text-gray-800" },
  63: { icon: <WiRain className="text-blue-500" />, label: "Moderate rain", bg: "from-slate-600 via-blue-700 to-gray-900", card: "bg-gray-100/80 text-gray-900" },
  65: { icon: <WiRain className="text-blue-600" />, label: "Heavy rain", bg: "from-gray-700 via-slate-800 to-black", card: "bg-gray-800/70 text-white" },
  66: { icon: <WiRain className="text-cyan-300" />, label: "Freezing rain", bg: "from-cyan-500 via-blue-600 to-gray-700", card: "bg-blue-200/80 text-gray-900" },
  67: { icon: <WiRain className="text-cyan-400" />, label: "Heavy freezing rain", bg: "from-cyan-600 via-blue-700 to-gray-800", card: "bg-blue-200/80 text-gray-900" },
  71: { icon: <WiSnow className="text-blue-200" />, label: "Slight snow fall", bg: "from-blue-200 via-sky-300 to-gray-400", card: "bg-white/80 text-gray-800" },
  73: { icon: <WiSnow className="text-blue-100" />, label: "Moderate snow fall", bg: "from-sky-200 via-blue-300 to-gray-400", card: "bg-white/80 text-gray-800" },
  75: { icon: <WiSnow className="text-blue-100" />, label: "Heavy snow fall", bg: "from-sky-300 via-blue-400 to-gray-500", card: "bg-white/80 text-gray-800" },
  80: { icon: <WiShowers className="text-blue-400" />, label: "Rain showers", bg: "from-sky-400 via-blue-600 to-indigo-700", card: "bg-blue-100/80 text-gray-800" },
  81: { icon: <WiRain className="text-blue-500" />, label: "Moderate showers", bg: "from-blue-500 via-indigo-600 to-gray-800", card: "bg-gray-200/80 text-gray-900" },
  82: { icon: <WiRain className="text-blue-600" />, label: "Heavy showers", bg: "from-slate-700 via-blue-800 to-gray-900", card: "bg-gray-700/70 text-white" },
  95: { icon: <WiThunderstorm className="text-yellow-200" />, label: "Thunderstorm", bg: "from-purple-700 via-indigo-800 to-gray-900", card: "bg-gray-800/80 text-white" },
  96: { icon: <WiNightAltThunderstorm className="text-yellow-100" />, label: "Storm with hail", bg: "from-purple-800 via-indigo-900 to-gray-950", card: "bg-gray-900/70 text-white" },
  99: { icon: <WiNightAltThunderstorm className="text-yellow-100" />, label: "Heavy storm with hail", bg: "from-indigo-900 via-gray-900 to-black", card: "bg-black/70 text-white" },
};

const getWeatherStyle = (code) =>
  weatherStyles[code] || { icon: <WiDaySunny />, label: "Unknown", bg: "from-sky-400 via-blue-500 to-indigo-600", card: "bg-white/80 text-gray-800" };

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    if (!city.trim()) return;

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const geoRes = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
      );

      if (!geoRes.data.results || geoRes.data.results.length === 0) {
        setError("City not found!");
        setLoading(false);
        return;
      }

      const { latitude, longitude, name, country } = geoRes.data.results[0];

      const weatherRes = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );

      setWeather({
        name,
        country,
        ...weatherRes.data.current_weather,
      });
    } catch (err) {
      console.error(err);
      setError("Failed to fetch weather data. Try again.");
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") fetchWeather();
  };

  const background = weather
    ? getWeatherStyle(weather.weathercode).bg
    : "from-sky-400 via-blue-500 to-indigo-600";
  const cardStyle = weather
    ? getWeatherStyle(weather.weathercode).card
    : "bg-white/80 text-gray-800";

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center bg-gradient-to-br transition-all duration-700 ease-in-out ${background}`}
    >
      <div
        className={`w-[95%] sm:w-[500px] ${cardStyle} backdrop-blur-lg rounded-3xl shadow-2xl p-8 text-center transition-all duration-500 hover:scale-[1.02]`}
      >
        <h1 className="text-4xl font-extrabold mb-6 text-white drop-shadow-lg tracking-wide">
          🌦 Weather Now
        </h1>

        {/* Search bar */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Search city..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-700 placeholder-gray-400"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button
            onClick={fetchWeather}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium transition-all active:scale-95"
          >
            Search
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center text-white">
            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
            <p>Fetching weather...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-red-200 font-semibold bg-red-500/30 px-3 py-2 rounded-lg mt-4">
            {error}
          </p>
        )}

        {/* Weather card */}
        {weather && (
          <div className="rounded-2xl p-6 shadow-xl mt-6 transition-transform transform hover:-translate-y-1 hover:shadow-2xl">
            <h2 className="text-2xl font-bold mb-3">
              {weather.name}, {weather.country}
            </h2>

            <div className="flex flex-col items-center mb-4 animate-fadeIn">
              <span className="text-7xl mb-1">
                {getWeatherStyle(weather.weathercode).icon}
              </span>
              <span className="text-lg opacity-90">
                {getWeatherStyle(weather.weathercode).label}
              </span>
              <span className="text-4xl font-extrabold mt-2">
                {weather.temperature}°C
              </span>
            </div>

            <div className="space-y-2 text-lg">
              <p className="flex items-center justify-center gap-2">
                💨 Wind Speed: {weather.windspeed} km/h
              </p>
              <p className="flex items-center justify-center gap-2">
                🧭 Direction: {weather.winddirection}°
              </p>
              <p className="text-sm text-gray-600 mt-3">
                Updated: {new Date(weather.time).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
