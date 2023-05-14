import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faLightbulb,
  faSearch,
  faSignIn,
  faUserPlus,
  faSignInAlt,
  faSearchPlus,
} from "@fortawesome/free-solid-svg-icons";
//import "./styles/tailwind.css";
import "./styles/tailwind.css";
import "./styles/pulse.css";

import { useEffect, useState } from "react";
import "./styles/transitions.css";
import { useSelector } from "react-redux";

import { Link } from "react-router-dom";
import backgroundPic from "./assets/resumai-background.jpg";

function App() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Set the component to visible after a delay
    const timer = setTimeout(() => {
      setVisible(true);
    }, 2000); // Adjust the delay as needed

    // Clean up the timer when the component is unmounted
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="transition-wrapper backdrop-blur-sm">
        {!visible && <div className="transition-background-entry"></div>}
        <div className={`transition-content ${visible ? "visible" : ""}`}></div>
        <div
          className="min-h-screen flex items-center justify-center bg-center bg-cover"
          style={{
            backgroundImage: `url(${backgroundPic})`,
          }}
        >
          <div className="bg-blue-400 p-8 bruh bg-opacity-30 rounded-lg shadow-md w-full max-w-md mx-auto border-2 border-black">
            <h2
              className="text-2xl font-semibold mb-4 text-center text-white"
              style={{
                fontFamily: "Roboto, sans-serif",
                letterSpacing: "0.05em",
                textShadow:
                  "0px 2px 4px rgba(0, 0, 0, 0.5), 0px 4px 6px rgba(0, 0, 0, 0.25)",
              }}
            >
              Welcome
            </h2>

            <div className="flex justify-center space-x-4">
              <Link
                to="/upload"
                className="px-4 py-2 opacity-61 hover:opacity-75 bg-gradient-to-r from-blue-500 via-blue-500 to-blue-400 text-white font-bold rounded hover:from-blue-400 hover:via-blue-300 hover:to-blue-200 transition-all"
              >
                Enhance Resume
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
