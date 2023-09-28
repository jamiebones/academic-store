import Head from "next/head";
import { Inter } from "next/font/google";
import React, { useState } from "react";
import Spinner from "../components/Spinner";
import ErrorDiv from "../components/Error";
import MessageDiv from "../components/MessageDiv";

const UploadFile = () => {
  <Head>
    <title>Upload Academic paper to Arweave</title>
    <meta name="description" content="Upload academic paper to Arweave" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="/favicon.ico" />
  </Head>;
  const fileInputRef = React.useRef();
  const [data, setData] = useState(null);
  const [filepath, setFilepath] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tags, setTags] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = async (event) => {
    event.preventDefault();
    setProcessingMessage("");
    setError("");
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    }
    try {
      setLoading(!loading);
      setFilepath("");
      setData(null);
      setError(null);
      const formData = new FormData();
      formData.append("file", fileInputRef.current.files[0]);
      setProcessingMessage("processing document please wait....");
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      // The API response
      const responsData = await response.json();
      const { data, error } = responsData;
      if (!error) {
        setFilepath(data.filepath);
        delete data.filepath;
        //build the tags here
        const applicationName = {
          name: "application-name",
          value: "arweave-hackathon",
        };
        const content = { name: "Content-Type", value: "application/pdf" };
        const abstract = {
          name: "abstract",
          value: data.abstract ? data.abstract : "",
        };
        const title = { name: "title", value: data.title ? data.title : "" };
        const keywords = {
          name: "keywords",
          value: data.keywords ? data.keywords : "",
        };
        const field = { name: "field", value: data.field ? data.field : "" };
        const author = {
          name: "author",
          value: data.author ? data.author : "",
        };
        const publishIn = {
          name: "publishIn",
          value: data.journal_name ? data.journal_name : "",
        };
        const metaData = [
          content,
          publishIn,
          title,
          keywords,
          field,
          author,
          abstract,
          applicationName,
        ];
        setTags(metaData);
        setData(data);
      } else {
        setError(error);
      }
      console.log("the returned data ", data); // Log the response from the API
    } catch (error) {
      setError(error.message);
      console.log("error ", error);
    } finally {
      setLoading(false);
      setProcessingMessage(null);
      fileInputRef.current.value = null;
      setSelectedFile(null);
    }
  };

  const paperUploadViaServer = async (event) => {
    event.preventDefault();
    if (!filepath && !tags) {
      setError("Please upload an academic document");
      return;
    }
    try {
      setError(null);
      setProcessing(true);
      setProcessingMessage("Uploading document to Arweave please wait....");
      const response = await fetch("/api/uploadFromServer", {
        method: "POST",
        body: JSON.stringify({
          filepath,
          metadata: tags,
        }),
      });

      // The API response
      const tx = await response.json();
      setProcessingMessage(
        `File uploaded successfully to: https://arweave.net/${tx}`
      );
      console.log(data); // Log the response from the API
      setData(null);
      fileInputRef.current.value = null;
      setSelectedFile(null);
    } catch (error) {
      setError(error.message);
      console.log("error ", error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="h-screen">
      <div className="flex justify-center items-center">
        {error && <ErrorDiv message={error} />}
      </div>

      <div className="flex justify-center items-center">
        {processingMessage && <MessageDiv message={processingMessage} />}
      </div>

      <div className="flex justify-center items-center mt-20">
        <div className="w-full max-w-5xl flex">
          <div className="w-1/2 h-96 p-4">
            <div className="mt-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="fileInput"
              >
                Choose a file:
              </label>
              <input
                id="fileInput"
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <div className="flex justify-between items-center border rounded-lg py-2 px-4 bg-white cursor-pointer">
                <span>
                  {selectedFile ? selectedFile.name : "No file chosen"}
                </span>
                <label
                  htmlFor="fileInput"
                  className="text-blue-500 hover:text-blue-600"
                >
                  Browse
                </label>
              </div>
            </div>
          </div>
          <div className="w-1/2 h-96 p-4">
            <div className="mt-4">
              {data && (
                <div>
                  <p className="mb-4 mb-4 bg-gray-200 p-2">
                    <span className="font-bold">Author Name</span>{" "}
                    <span className="ml-2">{data["author"]}</span>
                  </p>

                  <p className="mb-4 mb-4 bg-gray-200 p-2">
                    <span className="font-bold">Journal Name</span>{" "}
                    <span className="ml-2">{data["journal_name"]}</span>
                  </p>

                  <p className="mb-4 mb-4 bg-gray-200 p-2">
                    <span className="font-bold">Paper Title</span>{" "}
                    <span className="ml-2">{data["title"]}</span>
                  </p>

                  <p className="mb-4 mb-4 bg-gray-200 p-2">
                    <span className="font-bold">Abstract</span>{" "}
                    <span className="ml-2">{data["abstract"]}</span>
                  </p>

                  <p className="mb-4 bg-gray-200 p-2">
                    <span className="font-bold">Paper Field: </span>{" "}
                    <span className="ml-2">{data["field"]}</span>
                  </p>

                  <p className="mb-4 mb-4 bg-gray-200 p-2">
                    <span className="font-bold">Keywords</span>{" "}
                    <span className="ml-2">{data["keywords"]}</span>
                  </p>

                  <p className="mb-4 mb-4 bg-gray-200 p-2">
                    <span className="font-bold">Publication Date: </span>{" "}
                    <span className="ml-2">{data["publication_date"]}</span>
                  </p>

                  <div className="flex justify-center items-center">
                    <button
                      onClick={paperUploadViaServer}
                      disabled={processing}
                      className="bg-green-500 mb-2 text-black font-bold py-2 px-4 rounded-full hover:bg-lightBlue-600 focus:outline-none focus:ring-2 focus:ring-lightBlue-400 focus:ring-opacity-75"
                    >
                      {processing ? <Spinner /> : "Upload paper to Arweave"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadFile;
