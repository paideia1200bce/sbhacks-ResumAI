// Layout.tsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

import React from "react";
import { Link } from "react-router-dom";
//import Navbar from './Navbar';
import "./signup.css";
import "../styles/pulse.css";
import "../styles/nav.css";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      {/* <nav className="fixed top-0 left-0 w-full bg-white bg-opacity-50 shadow-md z-10"> */}
      <nav className="fixed top-0 left-0 w-full bg-blue-500 bg-opacity-20 backdrop-blur-lg shadow-md z-10 border-1 border-black hahaha">
        <div className="container mx-auto px-1 py-3 flex items-center justify-between">
          <div style={{ marginLeft: "-10px" }}>
            <Link
              to="/"
              className="text-lg font-semibold text-blue-800 hover:text-blue-600"
            >
              <h1 className="text-3xl font-semibold text-white rounded p-2 bruh mr-3 mb-1">
                ResumAI
              </h1>
            </Link>
          </div>
          <div className="rounded">
            <Link
              to="/about"
              className="text-lg font-semibold text-gray-400 hover:text-blue-600"
            >
              <FontAwesomeIcon icon={faInfoCircle} size="2x" />
            </Link>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </>
  );
};

export default Layout;
