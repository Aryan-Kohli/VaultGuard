import React from "react";
import { useEffect, useState } from "react";
import "./Display.css";
import { MdDocumentScanner } from "react-icons/md";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function Display({ account, myaddress, contract }) {
  const [data, setData] = useState([]);
  const [transactData, setTransactData] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const [addressaccess, setAddressAccess] = useState("");
  const [accessList, setAccessList] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [dataItem, Setdataitem] = useState(null);
  const [show, setShow] = useState(false);
  const [showtransModal, setShowtransModal] = useState(false);
  const [accessModal, setAccessModal] = useState(false);
  const [removeAccessModal, setRemoveAccessModal] = useState(false);


  const HandleCloseAccess = () => setAccessModal(false);
  const HandleCloseRemoveAccess = () => setRemoveAccessModal(false);

  
  const handletransClose = () => setShowtransModal(false);
  const handletransShow = () => setShowtransModal(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // const [action, SetAction] = useState("G");

  const timestamp = Date.now();
  const dateObject = new Date(timestamp);
  const humanReadableDate = dateObject.toLocaleString();

  const handleAddressInputChange = (e) => {
    setAddressAccess(e.target.value);
  };

  // const openModal = (data) => {
  //   setSelectedData(data);
  //   // setModalIsOpen(true);
  //   // setSelectedData(data);
  //   console.log(selectedData);
  //   console.log("modal opened");
  // };
  // const handleaccess = (data) => {
  //   setSelectedData(data);
  // };

  // const closeModal = () => {
  //   setModalIsOpen(false);
  // };
  function giveacces(data, addressaccess) {
    console.log("hete", addressaccess);
    // SetAction("G");
    Setdataitem(data);
    console.log(data);
    setAccessModal(true);
  }
  function removeAccess(data, addressaccess) {
    console.log("here", addressaccess);
    // SetAction("R");
    // console.log(action);
    Setdataitem(data);
    console.log(data);
    setRemoveAccessModal(true);
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
        toast.success("Accesss removed Successfully", {
          theme: "dark",
        });
        setRemoveAccessModal(false);
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
        toast.success("Accesss granted Successfully", {
          theme: "dark",
        });
        setAccessModal(false);
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
            {/* <th scope="col">#</th>
            <th scope="col">Access Details</th> */}
            {/* Add more <th> elements for other properties if needed */}
          </tr>
        </thead>
        <tbody>{accessListRows}</tbody>
      </table>
    );

    setAccessList(table);
    setShow(true);
    <Modal
    data-bs-theme="dark"
    show = {show} onHide = {handleClose} animation={false}>
     <Modal.Header closeButton>
       <Modal.Title>Access List</Modal.Title>
     </Modal.Header>
     <Modal.Body>
       {accessList}
     </Modal.Body>
     <Modal.Footer>
       <button onClick={handleClose}>Close</button>
     </Modal.Footer>
   </Modal>

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
            {/* <th scope="col">#</th>
            <th scope="col">Transaction Details</th> */}
            {/* Add more <th> elements for other properties */}
          </tr>
        </thead>
        <tbody>{transact}</tbody>
      </table>
    );

    setTransactData(table);
    setShowtransModal(true);
    <Modal
     data-bs-theme="dark"
     show = {showtransModal} onHide = {handletransClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Transactions Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {transactData}  
      </Modal.Body>
      <Modal.Footer>
       <button onClick={handletransClose}>Close</button>
     </Modal.Footer>
    </Modal>
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
      <div className="acc">
      <p className="heading">Recipient&apos;s Key :</p>
      <input
        name="addresses"
        type="text"
        placeholder="Enter adderess"
      ></input>
      </div>
    
      <button onClick={getdata} className="whiteBtn">
        List All Files
      </button>
      <div className="dataDiv">{data}</div>

      {/* <p>{addressaccess}</p> */}
      <button className="btn" onClick={getTransaction}>
        Get Transactions
      </button>
      <Modal
     data-bs-theme="dark"
     show = {showtransModal} onHide = {handletransClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Transactions Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {transactData}
        {/* <h2>Transactions</h2> */}
      </Modal.Body>
      <Modal.Footer>
       <button onClick={handletransClose}>Close</button>
     </Modal.Footer>
    </Modal>
      {/* <div className="transactionDiv">{transactData}</div> */}
      <div className="acc">
        <p className="heading">Sender&apos; Key:</p>
        <input
        type="text"
        onChange={(e) => {
          setAddressAccess(e.target.value);
          console.log(addressaccess);
        }}
        placeholder="Give / Remove Access"
      />
      </div>
      <div className="but-give-revoke">
      <button className="but5" onClick={() => myFunc(addressaccess)}>
        Confirm GIVE Access
      </button>
      <button className="but6" onClick={() => myFunc2(addressaccess)}>
        Confirm REMOVE Access
      </button>
      </div>
      {/* <h1 className="acc">AccessList</h1>
      <Button variant = "primary" onClick={handleShow} >Get Access List</Button> */}
      <Modal
       data-bs-theme="dark"
       show = {show} onHide = {handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Access List</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {accessList}
        </Modal.Body>
        <Modal.Footer>
          <button onClick={handleClose}>Close</button>
        </Modal.Footer>
      </Modal>
      {/* <div>{accessList}</div> */}

      <Modal
        data-bs-theme="dark"
       show = {accessModal} onHide = {HandleCloseAccess}>
        <Modal.Header>
          <Modal.Title>Confirming To Give Access</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>Are You sure you want to give Access ?</p>
        </Modal.Body>
        <Modal.Footer>
        <button onClick = {() => myFunc(addressaccess)}>Yes</button>
        <button onClick = {HandleCloseAccess}>No</button>
        </Modal.Footer>
      </Modal>

      <Modal
        data-bs-theme="dark"
       show = {removeAccessModal} onHide = {HandleCloseAccess}>
        <Modal.Header>
          <Modal.Title>Confirming To Remove Access</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>Are You sure you want to remove Access ?</p>
        </Modal.Body>
        <Modal.Footer>
        <button onClick = {() => myFunc2(addressaccess)}>Yes</button>
        <button onClick = {HandleCloseRemoveAccess}>No</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
