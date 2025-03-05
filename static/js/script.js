// Fetch weather data based on city name input
function fetchWeather() {
  const city = document.getElementById("cityInput").value;
  if (!city) {
    alert("Please enter a city name");
    return;
  }

  fetch(`/weather?city=${city}`)
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        alert(data.error);
        return;
      }
      document.getElementById("cityName").innerText = city;
      document.getElementById("temperature").innerText = data.current_weather.temperature;
      document.getElementById("windSpeed").innerText = data.current_weather.windspeed;
      document.getElementById("humidity").innerText = "N/A"; // Open-Meteo doesn't provide humidity
      document.getElementById("weatherResult").classList.remove("hidden");
    })
    .catch(error => {
      console.error("Error fetching weather:", error);
      alert("Failed to fetch weather data");
    });
}

// Fetch weather data based on user's geolocation
function fetchWeatherByLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        fetch(`/weather?lat=${lat}&lon=${lon}`)
          .then(response => response.json())
          .then(data => {
            if (data.error) {
              alert(data.error);
              return;
            }
            document.getElementById("cityName").innerText = "Your Location";
            document.getElementById("temperature").innerText = data.current_weather.temperature;
            document.getElementById("windSpeed").innerText = data.current_weather.windspeed;
            document.getElementById("humidity").innerText = "N/A"; // Open-Meteo doesn't provide humidity
            document.getElementById("weatherResult").classList.remove("hidden");
          })
          .catch(error => {
            console.error("Error fetching weather:", error);
            alert("Failed to fetch weather data");
          });
      },
      function(error) {
        alert("Geolocation error: " + error.message);
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}
