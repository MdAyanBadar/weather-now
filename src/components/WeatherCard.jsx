
const WeatherCard = ({ weather }) => {
  return (
    <div className="bg-white/70 rounded-xl p-5 shadow-md mt-4">
      <h2 className="text-2xl font-semibold mb-2">
        {weather.name}, {weather.country}
      </h2>
      <p className="text-gray-700 text-lg">
        🌡 Temperature: <span className="font-medium">{weather.temperature}°C</span>
      </p>
      <p className="text-gray-700 text-lg">
        💨 Wind Speed: <span className="font-medium">{weather.windspeed} km/h</span>
      </p>
      <p className="text-gray-700 text-lg">
        🧭 Wind Direction: <span className="font-medium">{weather.winddirection}°</span>
      </p>
      <p className="text-gray-700 text-lg">
        ⏰ Time: <span className="font-medium">{new Date(weather.time).toLocaleString()}</span>
      </p>
    </div>
  );
};

export default WeatherCard;
