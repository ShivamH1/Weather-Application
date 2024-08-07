import React, { useState, useEffect } from "react";
import axios from "axios";
import apiKeys from "./apiKeys";
import ReactAnimatedWeather from "react-animated-weather";

function Forcast(props) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [weather, setWeather] = useState({});

  // Function to search for weather data based on a city name
  // It makes a GET request to the OpenWeather API's weather endpoint
  // with the city name, units set to metric, and the API key
  // It parses the response and updates the state variables 'weather', 'query', and 'error'
  const search = (city) => {
    // Make a GET request to the OpenWeather API's weather endpoint
    axios.get(
      // The URL for the request is constructed using template literals
      // The city name is passed as a parameter to the function
      // If the city name is not a string, use the value of the 'query' state variable instead
      `${apiKeys.base}weather?q=${
        city != "[object Object]" ? city : query
      }&units=metric&APPID=${apiKeys.key}`
    )
    .then((response) => {
      // If the request is successful, update the state variables
      // 'weather' is updated with the response data
      // 'query' is updated with an empty string
      setWeather(response.data);
      setQuery("");
    })
    .catch(function (error) {
      // If there is an error, log the error to the console
      console.log(error);
      // Update the state variables
      // 'weather' is updated with an empty string
      // 'query' is updated with an empty string
      // 'error' is updated with an object containing the error message and the query value
      setWeather("");
      setQuery("");
      setError({ message: "Not Found", query: query });
    });
  };
  /**
   * This function takes a single parameter, 'i', which represents a number.
   * The function checks if the number is less than 10. If it is, the function
   * adds a leading zero to the number and returns the modified number.
   * If the number is not less than 10, the function simply returns the number.
   * 
   * @param {number} i - The number to be checked and potentially modified.
   * @return {string|number} - The modified number with a leading zero, or the
   *                          original number if it is not less than 10.
   */
  // function checkTime(i) {
  //   // Check if the number is less than 10
  //   if (i < 10) {
  //     // If it is, add a leading zero and update the value of 'i'
  //     i = "0" + i;
  //   }
  //   // Return the updated value of 'i'
  //   return i;
  // }
  const defaults = {
    color: "white",
    size: 112,
    animate: true,
  };

  useEffect(() => {
    search("Pune");
  }, []);

  return (
    // This is the main return statement for the Forcast component. 
    // It returns a <div> element with the class "forecast".
    <div className="forecast">
      {/* This is a <div> element with the class "forecast-icon". */}
      {/* It contains a ReactAnimatedWeather component that displays the weather icon. */}
      <div className="forecast-icon">
        <ReactAnimatedWeather
          // The icon prop is set to the value of the 'icon' property from the props object.
          icon={props.icon}
          // The color prop is set to the value of the 'color' property from the 'defaults' object.
          color={defaults.color}
          // The size prop is set to the value of the 'size' property from the 'defaults' object.
          size={defaults.size}
          // The animate prop is set to the value of the 'animate' property from the 'defaults' object.
          animate={defaults.animate}
        />
      </div>
      {/* This is a <div> element with the class "today-weather". */}
      {/* It contains a <h3> element that displays the weather description. */}
      {/* It also contains a search bar and other weather information. */}
      <div className="today-weather">
        <h3>{props.weather}</h3>
        {/* This is a <div> element with the class "search-box". */}
        {/* It contains an <input> element that allows the user to search for a city. */}
        {/* It also contains an <img> element that triggers the search when clicked. */}
        <div className="search-box">
          <input
            type="text"
            className="search-bar"
            placeholder="Search any city"
            // The onChange event handler updates the 'query' state variable with the value of the input field.
            onChange={(e) => setQuery(e.target.value)}
            // The value prop is set to the value of the 'query' state variable.
            value={query}
          />
          <div className="img-box">
            {" "}
            <img
              src="https://images.avishkaar.cc/workflow/newhp/search-white.png"
              // The onClick event handler triggers the 'search' function when clicked.
              onClick={search}
            />
          </div>
        </div>
        <ul>
          {/* This checks if the 'weather.main' property is defined. */}
          {typeof weather.main != "undefined" ? (
            <div>
              {" "}
              {/* This is a <li> element that displays the city name and the weather icon. */}
              <li className="cityHead">
                <p>
                  {weather.name}, {weather.sys.country}
                </p>
                <img
                  className="temp"
                  // The src prop is set to the URL of the weather icon.
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                />
              </li>
              {/* This is a <li> element that displays the temperature. */}
              <li>
                Temperature{" "}
                <span className="temp">
                  {Math.round(weather.main.temp)}°c ({weather.weather[0].main})
                </span>
              </li>
              {/* This is a <li> element that displays the humidity. */}
              <li>
                Humidity{" "}
                <span className="temp">
                  {Math.round(weather.main.humidity)}%
                </span>
              </li>
              {/* This is a <li> element that displays the visibility. */}
              <li>
                Visibility{" "}
                <span className="temp">
                  {Math.round(weather.visibility)} mi
                </span>
              </li>
              {/* This is a <li> element that displays the wind speed. */}
              <li>
                Wind Speed{" "}
                <span className="temp">
                  {Math.round(weather.wind.speed)} Km/h
                </span>
              </li>
            </div>
          ) : (
            <li>
              {/* This is a <li> element that displays the error message and the query value. */}
              {error.query} {error.message}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
export default Forcast;

