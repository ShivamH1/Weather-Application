import React from "react";
import CurrentLocation from "./currentLocation";
import "./App.css";

function App() {
  return (
    <React.Fragment>
      <div className="container">
        <CurrentLocation />
      </div>
      <div className="footer-info">
        <a target="_blank" href="https://github.com/ShivamH1/Weather-Application">
          Download Source Code
        </a>{" "}
        | Developed by{" "}
        <a target="_blank" href="https://twitter.com/shivam_honrao">
          Shivam Honrao
        </a>{" "}
        | Powered by{" "}
        <a target="_blank" href="https://www.linkedin.com/in/shivam-honrao-1789481b9/">
          Shivam
        </a>
      </div>
    </React.Fragment>
  );
}

export default App;
