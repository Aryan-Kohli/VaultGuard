import React from "react";
import { useEffect, useState } from "react";
import "./Display.css";
import { MdDocumentScanner } from "react-icons/md";
import Modal from "react-modal";

export default function Display({ account, myaddress, contract }) {
  const [data, setData] = useState([]);
  const [transactData, setTransactData] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const [addressaccess, setAddressAccess] = useState("");
  const [accessList, setAccessList] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [dataItem, Setdataitem] = useState(null);
  // const [action, SetAction] = useState("G");

  const timestamp = Date.now();
  const dateObject = new Date(timestamp);
  const humanReadableDate = dateObject.toLocaleString();

  const handleAddressInputChange = (e) => {
    setAddressAccess(e.target.value);
  };

  const openModal = (data) => {
    setSelectedData(data);
    setModalIsOpen(true);
    // setSelectedData(data);
    console.log(selectedData);
    console.log("modal opened");
  };
  // const handleaccess = (data) => {
  //   setSelectedData(data);
  // };

  const closeModal = () => {
    setModalIsOpen(false);
  };
  function giveacces(data, addressaccess) {
    console.log("hete", addressaccess);
    // SetAction("G");
    Setdataitem(data);
    console.log(data);
  }
  function removeAccess(data, addressaccess) {
    console.log("here", addressaccess);
    // SetAction("R");
    // console.log(action);
    Setdataitem(data);
    console.log(data);
  }
  async function handleRemoveAccess(addressaccess, data) {
    console.log("address is ", addressaccess);
    console.log(data);
    // myFunc(addressaccess);
    if (data && addressaccess) {
      try {
        console.log("done", data);
        await contract.removeAccess(
          data.url,
          addressaccess,
          data.name + " removed access for " + addressaccess,
          humanReadableDate
        );
        console.log(addressaccess);
      } catch (error) {
        console.error("Error calling contract.giveAccess:", error);
      }
    } else {
      console.log("No data selected");
    }
  }
  async function handleGiveAccess(addressaccess, data) {
    console.log("address is ", addressaccess);
    console.log(data);
    // myFunc(addressaccess);
    if (data && addressaccess) {
      try {
        console.log("done", data);
        await contract.giveAccess(
          data.url,
          data.name,
          humanReadableDate,
          "128kb",
          addressaccess,
          data.name + " shared with " + addressaccess
        );
        console.log(addressaccess);
      } catch (error) {
        console.error("Error calling contract.giveAccess:", error);
      }
    } else {
      console.log("No data selected");
    }
  }

  async function handleaccessList(url) {
    var list = await contract.getAccesList(url);
    console.log(url);

    const accessListRows = list.map((item, index) => {
      return (
        <tr key={index}>
          <td>{index + 1}</td> {/* Row number */}
          <td>{item[0]}</td>{" "}
          {/* Adjust this based on the properties of your access list item */}
          {/* Add more <td> elements for other properties of the item if needed */}
        </tr>
      );
    });

    const table = (
      <table className="table table-dark table-hover mt-4 table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Access Details</th>
            {/* Add more <th> elements for other properties if needed */}
          </tr>
        </thead>
        <tbody>{accessListRows}</tbody>
      </table>
    );

    setAccessList(table);
  }

  const myFunc = (address) => {
    console.log(address);
    handleGiveAccess(address, dataItem);
  };

  const myFunc2 = (address) => {
    console.log(address);
    setAccessList([]);
    handleRemoveAccess(address, dataItem);
  };

  async function getTransaction() {
    let transaction = await contract.getTransactions();

    // Check the structure of the transaction data
    console.log(transaction); // Log the transaction to see its structure

    // Convert to a mutable array if necessary
    const mutableTransactions = Array.from(transaction); // or use [...transaction]

    // Reverse the order of the transaction array
    const transact = mutableTransactions.reverse().map((item, index) => {
      return (
        <tr key={index}>
          <td>{mutableTransactions.length - index}</td>{" "}
          {/* Row number in reverse order */}
          <td>{item[0]}</td>{" "}
          {/* Adjust this based on the properties of your transaction */}
          {/* Add more <td> elements for other properties of the transaction if needed */}
        </tr>
      );
    });

    const table = (
      <table className="table table-dark mt-4 table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Transaction Details</th>
            {/* Add more <th> elements for other properties */}
          </tr>
        </thead>
        <tbody>{transact}</tbody>
      </table>
    );

    setTransactData(table);
  }

  const handleDownload = async (url, filename) => {
    try {
      const response = await fetch(url);
      console.log(response);
      // Check if the response is okay
      // if (!response.ok) {
      //   throw new Error(`Failed to download file: ${response.statusText}`);
      // }

      const blob = await response.blob();
      const link = document.createElement("a");
      const blobUrl = URL.createObjectURL(blob);

      // Automatically set the filename if it's not provided
      const contentDisposition = response.headers.get("content-disposition");
      if (
        !filename &&
        contentDisposition &&
        contentDisposition.includes("filename=")
      ) {
        filename = contentDisposition
          .split("filename=")[1]
          .split(";")[0]
          .replace(/['"]/g, "");
      }

      // Default to a generic filename if none is provided
      filename = filename || "downloaded_file";

      link.href = blobUrl;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl); // Clean up
    } catch (error) {
      console.error("Download failed:", error);
    }
  };
  async function getdata() {
    let dataArray;
    const otherAddress = document.getElementsByName("addresses")[0].value;
    if (otherAddress) {
      let s1 = myaddress + " have acessed file at " + humanReadableDate;
      dataArray = await contract.sharedFiles(otherAddress);
      console.log(dataArray);
      const isEmpty = Object.keys(dataArray).length === 0;
      if (isEmpty) {
      } else {
        const imgs = dataArray.map((data, index) => {
          return (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{data.name}</td>
              <td>{data.size}</td> {/* Display size in MB */}
              <td>{new Date(data.timeStamp).toLocaleString()}</td>{" "}
              {/* Convert timestamp */}
              <td>
                <button
                  className="download_btn"
                  onClick={() =>
                    handleDownload(
                      `https://gateway.pinata.cloud/ipfs/${data.url}`,
                      data.name
                    )
                  }
                >
                  Download File
                </button>
              </td>
            </tr>
          );
        });

        const table = (
          <table className="table mt-4 table-hover table-dark ">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">File Name</th>
                <th scope="col">File Size</th>
                <th scope="col">Uploaded Time</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>{imgs}</tbody>
          </table>
        );

        setData(table);
      }

      console.log(dataArray);
    } else {
      dataArray = await contract.getMyFiles();
      console.log(dataArray);
      const isEmpty = Object.keys(dataArray).length === 0;
      if (isEmpty) {
      } else {
        const imgs = dataArray.map((data, index) => {
          return (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{data.name}</td>
              <td>{data.size}</td> {/* Display size in MB */}
              <td>{new Date(data.timeStamp).toLocaleString()}</td>{" "}
              {/* Convert timestamp */}
              <td>
                <button
                  className="download_btn"
                  onClick={() =>
                    handleDownload(
                      `https://gateway.pinata.cloud/ipfs/${data.url}`,
                      data.name
                    )
                  }
                >
                  Download File
                </button>
              </td>
              <td>
                <button
                  className="btn_small1"
                  onClick={() => giveacces(data, addressaccess)}
                >
                  Give Access
                </button>
              </td>
              <td>
                <button
                  className="btn_small1"
                  onClick={() => removeAccess(data, addressaccess)}
                >
                  Remove Access
                </button>
              </td>
              <td>
                <button
                  className="btn_small1"
                  onClick={() => handleaccessList(data.url)}
                >
                  GetAccessList
                </button>
              </td>
            </tr>
          );
        });

        const table = (
          <table className="table mt-4 table-hover table-dark ">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">File Name</th>
                <th scope="col">File Size</th>
                <th scope="col">Uploaded Time</th>
                <th scope="col">Actions</th>
                <th scope="col">Give Access</th>
                <th scope="col">Remove Access</th>
                <th scope="col">Access List</th>
              </tr>
            </thead>
            <tbody>{imgs}</tbody>
          </table>
        );

        setData(table);
      }
    }
  }
  return (
    <div className="displayImgdiv">
      {/* <h1>IMAGES DATA</h1> */}
      <input
        name="addresses"
        className="addressinput"
        placeholder="Enter adderess"
      ></input>
      <button onClick={getdata} className="searchFiles">
        Search files
      </button>
      <div className="dataDiv">{data}</div>

      <p>{addressaccess}</p>
      <button className="btn" onClick={getTransaction}>
        Get Transactions
      </button>
      <div className="transactionDiv">{transactData}</div>
      <input
        className="addressinput"
        type="text"
        onChange={(e) => {
          setAddressAccess(e.target.value);
          console.log(addressaccess);
        }}
        placeholder="Give / Remove Access"
      />
      <button className="btn_small" onClick={() => myFunc(addressaccess)}>
        Confirm GIVE Access
      </button>
      <br />
      <button className="btn_small" onClick={() => myFunc2(addressaccess)}>
        Confirm REMOVE Access
      </button>
      <h1 class="acc">AccessList</h1>
      <div>{accessList}</div>
    </div>
  );
}
