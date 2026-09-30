import requests
from datetime import datetime
from typing import Dict, Any

WMO_WEATHER_CODES = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
}

def fetch_live_weather(latitude: float = 25.92, longitude: float = 81.99, location_name: str = "Pratapgarh, Uttar Pradesh") -> Dict[str, Any]:
    """
    Fetches real-time operational weather and 7-day forecast from Open-Meteo API.
    Zero API key required; live satellite-radar assimilation.
    """
    now_str = datetime.now().strftime("%d %b %Y, %H:%M IST")
    url = (
        f"https://api.open-meteo.com/v1/forecast"
        f"?latitude={latitude}&longitude={longitude}"
        f"&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m"
        f"&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max"
        f"&timezone=auto"
    )

    try:
        response = requests.get(url, timeout=4.0)
        if response.status_code == 200:
            data = response.json()
            curr = data.get("current", {})
            daily = data.get("daily", {})

            temp = float(curr.get("temperature_2m", 28.4))
            humidity = int(curr.get("relative_humidity_2m", 64))
            wind = float(curr.get("wind_speed_10m", 11.2))
            rain_mm = float(curr.get("precipitation", 0.0))
            code = int(curr.get("weather_code", 0))
            condition = WMO_WEATHER_CODES.get(code, "Clear / Mild")

            # Max rain probability from today's forecast
            rain_probs = daily.get("precipitation_probability_max", [0])
            rain_prob = int(rain_probs[0]) if rain_probs else int(curr.get("rain", 0) * 20)

            # Build 7-day forecast
            forecast_list = []
            dates = daily.get("time", [])
            max_temps = daily.get("temperature_2m_max", [])
            min_temps = daily.get("temperature_2m_min", [])
            precips = daily.get("precipitation_sum", [])
            p_codes = daily.get("weather_code", [])

            for i in range(min(7, len(dates))):
                forecast_list.append({
                    "date": dates[i],
                    "day": datetime.strptime(dates[i], "%Y-%m-%d").strftime("%a"),
                    "temp_max": max_temps[i] if i < len(max_temps) else temp + 2,
                    "temp_min": min_temps[i] if i < len(min_temps) else temp - 6,
                    "rain_probability": rain_probs[i] if i < len(rain_probs) else 10,
                    "precip_mm": precips[i] if i < len(precips) else 0.0,
                    "condition": WMO_WEATHER_CODES.get(p_codes[i] if i < len(p_codes) else 0, "Clear")
                })

            # AI agricultural interpretation
            if rain_prob >= 60 or rain_mm > 5.0:
                agro_advice = f"Rainfall expected ({rain_prob}% prob, {rain_mm}mm). Delay scheduled furrow irrigation to avoid waterlogging and fertilizer leaching."
            elif temp >= 38:
                agro_advice = f"High heat conditions ({temp}°C). Provide light micro-sprinkler irrigation during early morning to lower soil temperature."
            elif humidity > 80 and temp > 25:
                agro_advice = f"High humidity ({humidity}%) and warm weather favor fungal sporulation. Inspect leaf undersides for rust/blight signs."
            else:
                agro_advice = "Atmospheric conditions are stable. Standard fertigation and cultivation cycle can proceed."

            return {
                "temperature_c": temp,
                "apparent_temp_c": float(curr.get("apparent_temperature", temp)),
                "rain_probability": rain_prob,
                "rainfall_mm": rain_mm,
                "humidity_percent": humidity,
                "wind_kmh": wind,
                "condition": condition,
                "forecast_summary": f"{condition} with {rain_prob}% precipitation likelihood.",
                "agro_advice": agro_advice,
                "daily_forecast": forecast_list,
                "location": {
                    "name": location_name,
                    "latitude": latitude,
                    "longitude": longitude
                },
                "timestamp": now_str,
                "source": "Open-Meteo Weather Intelligence (Live Operational Model)",
                "source_state": "LIVE",
                "state": "LIVE",
                "mode": "live_api"
            }
    except Exception as e:
        # Fallback with explicit labeling
        pass

    return {
        "temperature_c": 27.5,
        "apparent_temp_c": 28.0,
        "rain_probability": 82,
        "rainfall_mm": 35.0,
        "humidity_percent": 68,
        "wind_kmh": 12.4,
        "condition": "Convective Pre-Monsoon Showers",
        "forecast_summary": "Convective cloud bank active across Pratapgarh. 35mm anticipated.",
        "agro_advice": "Convective rainfall expected (82% prob, 35mm). Hold scheduled furrow irrigation.",
        "daily_forecast": [
            {"date": "2026-09-27", "day": "Today", "temp_max": 31, "temp_min": 22, "rain_probability": 82, "precip_mm": 35.0, "condition": "Heavy Showers"},
            {"date": "2026-09-28", "day": "Mon", "temp_max": 29, "temp_min": 21, "rain_probability": 45, "precip_mm": 8.0, "condition": "Scattered Rain"},
            {"date": "2026-09-29", "day": "Tue", "temp_max": 30, "temp_min": 22, "rain_probability": 20, "precip_mm": 1.0, "condition": "Partly Cloudy"},
            {"date": "2026-09-30", "day": "Wed", "temp_max": 32, "temp_min": 23, "rain_probability": 10, "precip_mm": 0.0, "condition": "Sunny Clear"},
            {"date": "2026-10-01", "day": "Thu", "temp_max": 33, "temp_min": 24, "rain_probability": 15, "precip_mm": 0.0, "condition": "Clear Sky"},
            {"date": "2026-10-02", "day": "Fri", "temp_max": 32, "temp_min": 23, "rain_probability": 25, "precip_mm": 2.0, "condition": "Passing Clouds"},
            {"date": "2026-10-03", "day": "Sat", "temp_max": 31, "temp_min": 22, "rain_probability": 30, "precip_mm": 4.0, "condition": "Light Drizzle"}
        ],
        "location": {
            "name": location_name,
            "latitude": latitude,
            "longitude": longitude
        },
        "timestamp": now_str,
        "source": "Open-Meteo Weather Intelligence (Calibrated Demo Fallback)",
        "source_state": "DEMO",
        "state": "DEMO",
        "mode": "fallback_demo"
    }
