// This is a React component for fetching & displaying weather data based on user's location

import React from "react"; // Importing React library
import apiKeys from "./apiKeys"; // Importing API keys for OpenWeather API
import Clock from "react-live-clock"; // Importing a component for displaying live clock
import Forcast from "./forcast"; // Importing a component for displaying weather forecast
import loader from "./images/WeatherIcons.gif"; // Importing a loader image
import ReactAnimatedWeather from "react-animated-weather"; // Importing a component for displaying animated weather icons

// Function to build a date string from a date object
const dateBuilder = (d) => {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day}, ${date} ${month} ${year}`;
};

/**
 * The 'defaults' object contains default values for various properties
 * related to the weather component. These defaults are used as fallback
 * values when the actual values are not available.
 *
 * The 'defaults' object has the following properties:
 * - 'color': The default color for the weather icon. The default value is 'white'.
 * - 'size': The default size of the weather icon. The default value is 112.
 * - 'animate': A boolean value indicating whether the weather icon should be animated or not.
 *   The default value is true.
 */
const defaults = {
  // The default color for the weather icon.
  color: "white",
  // The default size of the weather icon.
  size: 112,
  // A boolean value indicating whether the weather icon should be animated or not.
  animate: true,
};

// Weather component class
class Weather extends React.Component {
  state = {
    lat: undefined, // Latitude of the user's location
    lon: undefined, // Longitude of the user's location
    errorMessage: undefined, // Error message if any
    temperatureC: undefined, // Temperature in Celsius
    temperatureF: undefined, // Temperature in Fahrenheit
    city: undefined, // City name
    country: undefined, // Country name
    humidity: undefined, // Humidity
    description: undefined, // Weather description
    icon: "CLEAR_DAY", // Weather icon
    sunrise: undefined, // Sunrise time
    sunset: undefined, // Sunset time
    errorMsg: undefined, // Error message
  };

  // Component lifecycle method - runs when component is mounted
  // This is a lifecycle method that runs when the component is mounted.
  // It checks if the browser supports geolocation. If it does, it tries to get
  // the user's current position using the geolocation API. If successful, it
  // calls the 'getWeather' method to fetch weather data for the user's location.
  // If there is an error, it falls back to a default location (18.51593, 73.92609)
  // and displays an alert message asking the user to enable location service.
  // If the browser doesn't support geolocation, it displays an alert message saying so.
  componentDidMount() {

    // Check if the browser supports geolocation
    if (navigator.geolocation) {

      // Get the user's current position
      this.getPosition()

        // If successful, fetch weather data for the user's location
        .then((position) => {
          this.getWeather(position.coords.latitude, position.coords.longitude);
        })

        // If there is an error, fall back to a default location and display an alert message
        .catch((err) => {
          this.getWeather(18.51593, 73.92609);
          alert(
            "You have disabled location service. Allow 'This APP' to access your location. Your current location will be used for calculating Real time weather."
          );
        });

    } else {

      // If the browser doesn't support geolocation, display an alert message
      alert("Geolocation not available");
    }

    // Call getWeather function every 10 minutes
    this.timerID = setInterval(
      () => this.getWeather(this.state.lat, this.state.lon),
      600000
    );
  }

  // Component lifecycle method - runs when component is unmounted
  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  // Function to get user's position using browser's geolocation API
  // This function takes in an optional parameter 'options' which is an object
  // containing configuration options for the geolocation API.
  // The function returns a Promise that resolves with the user's position
  // or rejects with an error if the user's position cannot be obtained.
  getPosition = (options) => {
    // Create a new Promise that will be resolved or rejected later
    return new Promise(function (resolve, reject) {
      // Call the geolocation API's getCurrentPosition method to get the user's position
      // The getCurrentPosition method takes in 3 parameters:
      // - a success callback function that is called when the user's position is obtained
      // - an error callback function that is called when there is an error obtaining the user's position
      // - an options object that contains configuration options for the geolocation API (optional)
      navigator.geolocation.getCurrentPosition(
        // Success callback function
        // This function is called when the user's position is obtained
        // It takes in a Position object as a parameter that contains the user's latitude, longitude,
        // altitude, accuracy, etc.
        (position) => {
          // Resolve the Promise with the user's position
          resolve(position);
        },
        // Error callback function
        // This function is called when there is an error obtaining the user's position
        // It takes in a PositionError object as a parameter that contains information about the error
        (error) => {
          // Reject the Promise with the error
          reject(error);
        },
        // Options object
        // This object contains configuration options for the geolocation API
        options
      );
    });
  };

  // Function to fetch weather data from OpenWeather API
  // Function to fetch weather data from OpenWeather API
  // This function takes in the latitude and longitude of the user's location as parameters
  // It uses the fetch API to make a GET request to the OpenWeather API's weather endpoint
  // with the latitude, longitude, and API key as query parameters
  // It then uses the response from the API call to update the state of the Weather component
  // with the relevant weather data
  getWeather = async (lat, lon) => {
    // Make a GET request to the OpenWeather API's weather endpoint with the user's latitude, longitude, and API key
    const api_call = await fetch(
      // Construct the URL for the API request
      `${apiKeys.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${apiKeys.key}`
    );

    // Parse the response from the API call as JSON
    const data = await api_call.json();

    // Update the state of the Weather component with the relevant weather data
    this.setState({
      // Set the latitude and longitude of the user's location in the state
      lat: lat,
      lon: lon,
      // Set the city name in the state
      city: data.name,
      // Set the current temperature in Celsius in the state
      temperatureC: Math.round(data.main.temp),
      // Set the current temperature in Fahrenheit in the state
      temperatureF: Math.round(data.main.temp * 1.8 + 32),
      // Set the current humidity in the state
      humidity: data.main.humidity,
      // Set the main weather condition in the state
      main: data.weather[0].main,
      // Set the country name in the state
      country: data.sys.country,
    });
    switch (this.state.main) {
      case "Haze":
        this.setState({ icon: "CLEAR_DAY" });
        break;
      case "Clouds":
        this.setState({ icon: "CLOUDY" });
        break;
      case "Rain":
        this.setState({ icon: "RAIN" });
        break;
      case "Snow":
        this.setState({ icon: "SNOW" });
        break;
      case "Dust":
        this.setState({ icon: "WIND" });
        break;
      case "Drizzle":
        this.setState({ icon: "SLEET" });
        break;
      case "Fog":
        this.setState({ icon: "FOG" });
        break;
      case "Smoke":
        this.setState({ icon: "FOG" });
        break;
      case "Tornado":
        this.setState({ icon: "WIND" });
        break;
      default:
        this.setState({ icon: "CLEAR_DAY" });
    }
  };

  // Render method - renders the component
  render() {
    // If weather data is available, render the weather details
    if (this.state.temperatureC) {
      // Render the weather details
      return (
        // Fragment is used to group multiple elements without adding extra nodes to the DOM.
        <React.Fragment>
          {/* Container for displaying city information */}
          <div className="city">
            {/* Container for displaying city name and country */}
            <div className="title">
              {/* City name */}
              <h2>{this.state.city}</h2>
              {/* Country name */}
              <h3>{this.state.country}</h3>
            </div>
            {/* Container for displaying weather icon and weather condition */}
            <div className="mb-icon">
              {/* Display the weather icon */}
              {" "}
              <ReactAnimatedWeather
                // Weather icon
                icon={this.state.icon}
                // Color of the weather icon
                color={defaults.color}
                // Size of the weather icon
                size={defaults.size}
                // Animate the weather icon
                animate={defaults.animate}
              />
              {/* Weather condition */}
              <p>{this.state.main}</p>
            </div>
            {/* Container for displaying date and time */}
            <div className="date-time">
              {/* Container for displaying date, time and location */}
              <div className="dmy">
                {/* Container for displaying date */}
                <div id="txt"></div>
                {/* Container for displaying current time */}
                <div className="current-time">
                  {/* Display the current time */}
                  <Clock format="HH:mm:ss" interval={1000} ticking={true} />
                </div>
                {/* Container for displaying current date */}
                <div className="current-date">{dateBuilder(new Date())}</div>
              </div>
              {/* Container for displaying temperature */}
              <div className="temperature">
                {/* Display the temperature */}
                <p>
                  {this.state.temperatureC}°<span>C</span>
                </p>
              </div>
            </div>
          </div>
          {/* Container for displaying weather forecast */}
          <Forcast icon={this.state.icon} weather={this.state.main} />
        </React.Fragment>
      );
    } else {
      // If weather data is not available, render a loader and a message
      return (
        // Fragment is used to group multiple elements without adding extra nodes to the DOM.
        <React.Fragment>
          {/* Loader image */}
          <img
            src={loader}
            alt={"loading"}
            style={{ width: "50%", WebkitUserDrag: "none" }}
          />
          {/* Message for detecting location */}
          <h3 style={{ color: "white", fontSize: "22px", fontWeight: "600" }}>
            Detecting your location
          </h3>
          {/* Message for displaying current location */}
          <h3 style={{ color: "white", marginTop: "10px" }}>
            Your current location wil be displayed on the App <br></br> & used
            for calculating Real time weather.
          </h3>
        </React.Fragment>
      );
    }
  }
}

export default Weather;

