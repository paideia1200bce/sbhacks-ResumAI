import React, { useState } from "react";
import "../styles/tailwind.css";
import { faInfoCircle, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import axios from "axios";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backgroundPic from "../assets/resumai-background.jpg";
import "./signup.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import autoTable from "jspdf-autotable";
import * as html2pdf from "html2pdf.js";
import "../styles/pulse.css";

interface FeedbackProps {
  resumeResponse: any;
  onToggleView: () => void;
  isLoading: boolean;
}

const FeedbackView: React.FC<FeedbackProps> = ({
  resumeResponse,
  onToggleView,
  isLoading,
}) => {
  const navigate = useNavigate();

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  const { work_text_dict } = resumeResponse;

  const saveAsPDF = () => {
    const element = document.createElement("div");
    element.innerHTML = formattedText;
    element.style.fontSize = "16px";
    element.style.fontFamily = "Arial, sans-serif";

    const opt = {
      margin: [10, 10, 10, 10],
      filename: "Enhanced_Resume.pdf",
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "letter", orientation: "portrait" },
    };

    html2pdf().from(element).set(opt).save();
  };

  console.log("resumeResponse from prop: ", work_text_dict);

  //.map(([key, value]: [any, any]) => `${key}\n\n${value}\n\n`)
  const formattedText = Object.entries(work_text_dict)
    .map(([key, value]: [any, any]) => `\n${value}\n\n`)
    .join("");

  return (
    // <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
    <div
      className="min-h-screen flex items-center justify-center bg-center bg-cover overflow-hidden"
      // style={{
      //   backgroundImage: `url(${backgroundPic})`,
      // }}
    >
      <div>
        <nav className="fixed top-0 left-0 w-full bg-blue-500 bg-opacity-20 mt-5 backdrop-blur-lg shadow-md z-10 border-1 border-black hahaha">
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
            <div className="rounded mt-2">
              <Link
                to="/about"
                className="text-lg font-semibold text-gray-800 hover:text-blue-600"
              >
                <FontAwesomeIcon icon={faInfoCircle} size="2x" />
              </Link>
            </div>
          </div>
        </nav>
      </div>

      <div className="relative bruh w-1/2 border-2 border-black backdrop-blur-md bg-blue-500 bg-opacity-20 space-y-8 p-6 rounded-lg shadow-lg">
        <button
          className="absolute mt-2 ml-2 top-2 left-2 text-white"
          onClick={onToggleView}
        >
          <FiArrowLeft size={29} />
        </button>
        <div>
          <h2
            className="text-2xl font-semibold mb-4 text-center text-white"
            style={{
              fontFamily: "Roboto, sans-serif",
              letterSpacing: "0.05em",
              textShadow:
                "0px 2px 4px rgba(0, 0, 0, 0.5), 0px 4px 6px rgba(0, 0, 0, 0.25)",
            }}
          >
            Your Enhanced Resume:
          </h2>
        </div>
        <hr className="border-1 border-black mb-8" />
        <div className="mt-8">
          {/* <textarea
            value={Object.entries(resumeResponse)
              .map(([key, value]) => `${key}\n${value}`)
              .join("\n\n")}
            readOnly
            className="w-full h-96 px-3 py-2 text-white bg-black border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
          /> */}
          {resumeResponse ? (
            <>
              <textarea
                value={formattedText}
                readOnly
                className="w-full h-96 px-3 py-2 text-white bg-black border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                className="bg-blue-600 text-white py-2 px-4 rounded mt-4"
                onClick={saveAsPDF}
              >
                Save as PDF
              </button>
            </>
          ) : (
            <div className="text-white">Loading...</div>
          )}

          {/* {!isLoading ? (
            Object.entries(work_text_dict).map(([key, value]) => (
              <div key={key}>
                <h3 className="text-xl font-semibold">{key}</h3>
                <pre className="w-full px-3 py-2 text-white bg-black border border-gray-300 rounded-md resize-none whitespace-pre-wrap">
                  {value as string}
                </pre>
              </div>
            ))
          ) : (
            <Loader />
          )} */}
        </div>
      </div>
    </div>
  );
};

export default FeedbackView;
