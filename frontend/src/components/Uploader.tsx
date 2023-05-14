import React, { useState, useCallback } from "react";
//import "../styles/tailwind.css";
import "./login.css";
import { FiX } from "react-icons/fi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faLightbulb,
  faSearch,
  faSignIn,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import FeedbackView from "./Feedback";
//import { useQuery, useMutation } from "@apollo/react-hooks";
import "../styles/pulse.css";

import gql from "graphql-tag";
import axios from "axios";
import { useQuery, useMutation } from "@apollo/react-hooks";
import Loader from "./Loader";
import { Link, useNavigate } from "react-router-dom";
import backgroundPic from "../assets/resumai-background.jpg";
import { useDropzone, DropzoneOptions } from "react-dropzone";

//define the graphql mutation to handle the file upload:
// const UPLOAD_RESUME = gql`
//   mutation UploadResume($file: Upload!) {
//     saveResume(file: $file)
//     # {
//     #   success
//     #   message
//     #   file {
//     #     filename
//     #     mimetype
//     #     encoding
//     #   }
//     # }
//   }
// `;

// const [uploadResumeMutation, uploadedResumeResponse] =
//   useMutation(UPLOAD_RESUME);

type ResumeUploadProps = {
  onFileUpload: (file: File) => void;
};

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onFileUpload }) => {
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: any) => {
      onFileUpload(acceptedFiles[0]);
      setUploadedFileName(acceptedFiles[0]?.name || null);
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "application/pdf" as unknown as DropzoneOptions["accept"],
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed text-white border-black p-4"
    >
      <input {...getInputProps()} />
      {uploadedFileName ? (
        <p>File uploaded: {uploadedFileName}</p>
      ) : isDragActive ? (
        <p>Drop the resume PDF file here...</p>
      ) : (
        <p>Drag and drop a resume PDF file here, or click to select a file.</p>
      )}
    </div>
  );
};

const Uploader = () => {
  //const navigate = useNavigate();
  //let data = "";
  //const [resumeData, setResumeData] = useState<string | null>(null);
  const [resumeData, setResumeData] = useState<Record<string, string> | null>(
    null
  );

  const [collapsedFeedback, setCollapsedFeedback] = useState(true);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const handleToggleViewFeedback = () => {
    //accessed by the searchFilter component
    //console.log("activeSearch from Home.tsx", activeSearch);
    setCollapsedFeedback(!collapsedFeedback);
    setResumeData(null);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (selectedFile) {
      handleFileUpload(selectedFile);
    }

    // Send the pdf to the backend/API for text classification
  };

  async function handleFileUpload(file: File): Promise<void> {
    //throw new Error("Function not implemented.");
    // Make an API call to upload the file
    try {
      const formData = new FormData();
      formData.append("file", file);
      setIsLoading(true);
      /*const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });*/
      const response = await fetch("https://sbhacks-resum-ai.vercel.app/upload", {
        method: "POST",
        body: formData,
      });

      //const data = await response.text();
      const data = await response.json();
      const workTextDict = data.work_text_dict;
      const formattedData: Record<string, string> = {};
      for (const key in workTextDict) {
        formattedData[key] = workTextDict[key].replace(/\\n/g, "\n");
      }
      console.log("File upload response:", data);
      setResumeData(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error uploading file:", error);
      // Handle the error, e.g., show an error message, etc.
    }

    console.log("File uploaded:", file);
  }

  const handleSelectedFile = (file: File) => {
    setSelectedFile(file);
  };
  /* the react component to handle resume uploads from local disk and send data to backend for classification*/
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-center bg-cover"
      style={{
        backgroundImage: `url(${backgroundPic})`,
      }}
    >
      <form
        onSubmit={handleSubmit}
        className=" bg-blue-500 bg-opacity-20 backdrop-blur-md bruh p-8 border-2 border-black rounded-lg shadow-md w-full max-w-md mx-auto"
      >
        {/* ... */}
        <div
          className={`rounded-md shadow-sm -space-y-px mb-4 ${
            collapsedFeedback ? "block" : "hidden"
          } `}
        >
          {/* ... */}
          <div className="mt-4">
            <h1
              className="text-2xl font-semibold mb-6 text-center text-white"
              style={{
                fontFamily: "Roboto, sans-serif",
                letterSpacing: "0.05em",
                textShadow:
                  "0px 2px 4px rgba(0, 0, 0, 0.5), 0px 4px 6px rgba(0, 0, 0, 0.25)",
              }}
            >
              Upload your resume (PDF):
            </h1>
            <ResumeUpload onFileUpload={handleSelectedFile} />
          </div>
        </div>
        {/* ... */}
        <div className="flex justify-center">
          <button
            type="submit"
            className={`px-4 py-2 text-white font-semibold rounded hover:bg-opacity-80 mt-2 transition-all `}
            style={{
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(37, 99, 235, 0.6)",
            }}
            onClick={() => {
              setCollapsedFeedback(!collapsedFeedback);
            }}
          >
            Enhance
          </button>
        </div>
      </form>
      {resumeData && (
        <div
          className={`absolute z-10 border backdrop-blur-sm border-black w-full bg-blue-500 bg-opacity-25 p-6 rounded-lg shadow-lg transition-all duration-300  ${
            collapsedFeedback ? "hidden" : "block"
          } `}
        >
          <FeedbackView
            resumeResponse={resumeData}
            onToggleView={handleToggleViewFeedback}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
};

export default Uploader;
