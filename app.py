from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast"

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/weather", methods=["GET"])
def get_weather():
    # Check for latitude/longitude parameters first (from geolocation)
    lat = request.args.get("lat")
    lon = request.args.get("lon")
    city = request.args.get("city")

    if lat and lon:
        try:
            lat = float(lat)
            lon = float(lon)
        except ValueError:
            return jsonify({"error": "Invalid latitude or longitude"}), 400
    elif city:
        # For now, we use dummy coordinates when using the city name.
        # In a real application, you could integrate a geocoding API.
        lat, lon = 19.076, 72.8777  # Example: Mumbai, India
    else:
        return jsonify({"error": "City or coordinates required"}), 400

    params = {
        "latitude": lat,
        "longitude": lon,
        "current_weather": "true",
        "hourly": "temperature_2m,precipitation,weathercode",
        "wind_speed_unit": "kmh",
        "timezone": "auto"
    }

    response = requests.get(WEATHER_API_URL, params=params)
    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch weather data"}), 500

    data = response.json()
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)
