import React, { useState, useEffect } from "react";
import axios from "axios";
export default function FileUpload({ account, contract, provider }) {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No file chosen");
  const [uploading, setuploading] = useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("file", file);
      const metadata = JSON.stringify({
        name: "File name",
      });
      formData.append("pinataMetadata", metadata);

      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append("pinataOptions", options);
      setuploading(true);
      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            //  Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkZGE4MDRkYi01YjhlLTRiMGYtODg2OC04MWFkYWQwYmQ5MDQiLCJlbWFpbCI6ImtvaGxpYXJ5YW4yMUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiZDdkZTBiOTgyM2NmOTEzZTU0Y2QiLCJzY29wZWRLZXlTZWNyZXQiOiIyMTVhZjhkYmI3OTlmYTY3N2E3OTAyN2ZkNTg1NzcyMjYzN2ZkZjExMTFlYzM5M2Q3ZmI2MGFmODFjODZmNzJhIiwiaWF0IjoxNzEzNTM5OTU4fQ.x5pJ2NKHPiDNU1OQwhsYv26gjKApseewB0QO8z7jJWk`,
          },
          body: formData,
        }
      );
      const resData = await res.json();
      console.log(resData);
      const timestamp = Date.now();
      const dateObject = new Date(timestamp);
      const humanReadableDate = dateObject.toLocaleString();
      // const ImgHash = `https://gateway.pinata.cloud/ipfs/${resData.IpfsHash}`;
      // contract.add(account, resData.IpfsHash, fileName);
      var string = " Uploaded " + fileName + " at " + humanReadableDate;
      setuploading(false);
      await contract.AddFile(
        resData.IpfsHash,
        fileName,
        humanReadableDate,
        "128kb",
        string
      );
      console.log(string);

      alert("Successfully Image Uploaded");
      setFileName("No image selected");
      setFile(null);
    } catch (error) {
      console.log(error);
    }
  }
  function retreiveFile(e) {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
    console.log(e.target.files[0]);
    e.preventDefault();
  }
  return (
    <div>
      <div>{uploading && "FILE IS UPLOADING...."}</div>
      <div className="uploaddiv">
        <form action="" onSubmit={handleSubmit}>
          <label for="fileInput" class="custom-file-upload">
            Choose a file
          </label>
          <input
            id="fileInput"
            type="file"
            style={{ display: "none" }}
            onChange={retreiveFile}
          />
          <span className="fileNameDisplay">
            {fileName ? fileName : " CHOOSSE FILE "}
          </span>
          <button type="submit" className="uploadBtn" disabled={!file}>
            Upload File
          </button>
        </form>
      </div>
    </div>
  );
}
