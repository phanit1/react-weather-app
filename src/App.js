import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import axios from "axios";

function WeatherApp() {
  // const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");

  const API_KEY = "d4d5164107c694ebc2034ad62c64d012";

  // Fetch the list of countries from the API
  useEffect(() => {
    axios
      .get("https://countriesnow.space/api/v0.1/countries")
      .then((response) => {
        setCountries(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  // Fetch the list of cities when a country is selected
  useEffect(() => {
    if (selectedCountry !== "") {
      console.log(countries);
      for (let index = 0; index < countries.length; index++) {
        const element = countries[index];
        if (element.country === selectedCountry) {
          setCities(element.cities);
        }
      }
    }
  }, [selectedCountry]);

  const getWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${API_KEY}`
      );

      if (response.status === 200) {
        setWeatherData(response.data);
      } else {
        setError("Weather data not found.");
      }
    } catch (error) {
      setError("Error fetching data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div align="center">
      <h1>React Weather Forecast App</h1>
      <div>
        <label>Select Country:</label>
        <select onChange={(e) => setSelectedCountry(e.target.value)}>
          <option value="">Select a country</option>
          {countries.map((country, index) => (
            <option key={index} value={country.country}>
              {country.country}
            </option>
          ))}
        </select>
      </div>
      <br />
      <div>
        <label>Select City:</label>
        <select onChange={(e) => setSelectedCity(e.target.value)}>
          <option value="">Select a city</option>
          {cities.map((city, index) => (
            <option key={index} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>
      <br />
      <button onClick={getWeatherData}>Get Forecast</button>
      <br />
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <br />
      {weatherData && (
        <div>
          <Card
            bg="secondary"
            border="primary"
            style={{ width: "18rem", color: "white" }}
          >
            <Card.Header style={{ fontStyle: "bold" }}>
              Weather in {selectedCity}:
            </Card.Header>
            <Card.Body>
              <Card.Text>
                Temperature: {(weatherData.main.temp - 273.15).toFixed(2)}°C{" "}
                <br />
                Weather: {weatherData.weather[0].description} <br />
                Humidity: {weatherData.main.humidity}% <br />
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      )}
    </div>
  );
}

export default WeatherApp;
