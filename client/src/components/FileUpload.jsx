import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { MdFamilyRestroom } from "react-icons/md";
import "react-toastify/dist/ReactToastify.css";
import calculateTransactionCost from "./feesCalculator";

export default function FileUpload({ account, contract, provider }) {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No file chosen");
  const [uploading, setuploading] = useState(false);
  async function handleUnpin(cid) {
    console.log("cid ", cid);
    // const toastId = toast.loading("Unpinning file...", {
    //   theme: "dark",
    //   position: "top-right",
    //   autoClose: false,
    //   closeOnClick: false,
    //   draggable: false,
    // });
    try {
      const res = await fetch(`https://api.pinata.cloud/pinning/unpin/${cid}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkZGE4MDRkYi01YjhlLTRiMGYtODg2OC04MWFkYWQwYmQ5MDQiLCJlbWFpbCI6ImtvaGxpYXJ5YW4yMUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiZDdkZTBiOTgyM2NmOTEzZTU0Y2QiLCJzY29wZWRLZXlTZWNyZXQiOiIyMTVhZjhkYmI3OTlmYTY3N2E3OTAyN2ZkNTg1NzcyMjYzN2ZkZjExMTFlYzM5M2Q3ZmI2MGFmODFjODZmNzJhIiwiaWF0IjoxNzEzNTM5OTU4fQ.x5pJ2NKHPiDNU1OQwhsYv26gjKApseewB0QO8z7jJWk`,
        },
      });

      if (res.ok) {
        // toast.update(toastId, {
        //   render: "File successfully unpinned!",
        //   type: "success",
        //   isLoading: false,
        //   autoClose: 5000,
        // });
        console.log("file unpinned");
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to unpin the file.");
      }
    } catch (error) {
      toast.update(toastId, {
        render: `Error: ${error.message}`,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
      console.error("Error unpinning file:", error);
    }
  }
  async function handleSubmit(e) {
    e.preventDefault();

    let fileHash = null;
    let toastId = null;
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
      toastId = toast.loading("Uploading File... Please wait", {
        theme: "dark",
        position: "top-right",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      });
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
      fileHash = resData.IpfsHash;
      const timestamp = Date.now();
      const dateObject = new Date(timestamp);
      const humanReadableDate = dateObject.toLocaleString();
      // const ImgHash = `https://gateway.pinata.cloud/ipfs/${resData.IpfsHash}`;
      // contract.add(account, resData.IpfsHash, fileName);
      var string = " Uploaded " + fileName;
      setuploading(false);
      const fileSize = (file.size / 1024).toFixed(2);
      const addfileresp = await contract.AddFile(
        resData.IpfsHash,
        fileName,
        humanReadableDate,
        fileSize + "kb",
        string
      );
      const allfees = await calculateTransactionCost(addfileresp);
      toast.info(
        `Transaction Cost: \n ${allfees.totalCostInUSD.toFixed(
          4
        )} USD    \n ${allfees.totalCostInINR.toFixed(
          4
        )} INR         ${allfees.gasCostInEther.toFixed(4)} ETH `,
        {
          theme: "dark",
          position: "top-right",
          autoClose: 10000,

          closeOnClick: true,
          draggable: true,
        }
      );
      toast.update(toastId, {
        theme: "dark",
        render: `File Uploaded Successfully`,
        type: "success",
        autoClose: 5000,
        isLoading: false,
        closeButton: true,
      });
      // alert("Successfully Image Uploaded");
      setFileName("No image selected");
      setFile(null);
    } catch (error) {
      console.log(error);
      console.log(fileHash);
      if (fileHash) {
        handleUnpin(fileHash);
      }
      toast.update(toastId, {
        theme: "dark",
        render: "File not uploaded",
        type: "success",
        autoClose: 5000,
        isLoading: false,
        closeButton: true,
      });
      // toast.error("Error Uploading File");
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
      {/* <div>{uploading && "FILE IS UPLOADING...."}</div> */}
      <div className="uploaddiv">
        <form action="" onSubmit={handleSubmit}>
          <label htmlFor="fileInput" className="custom-file-upload">
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
