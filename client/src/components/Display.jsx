import React from "react";
import { useEffect, useState } from "react";
import "./Display.css";
import "./PDFButton.css";
import "./Modal.css";
import "./table.css";
import { MdDocumentScanner } from "react-icons/md";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { ethers } from "ethers";
import calculateTransactionCost from "./feesCalculator";
import { PDFDownloadLink } from "@react-pdf/renderer";
import TransactionsPdf from "./TransactionsPdf";
import { FaFilePdf } from "react-icons/fa";
import { decryptFile } from "./security";

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
  const [deletefileModal, setDeletefileModal] = useState(false);
  const [mutableTransactions, setMutableTransactions] = useState([]);

  const HandleCloseAccess = () => setAccessModal(false);
  const HandleCloseRemoveAccess = () => setRemoveAccessModal(false);
  const HandleCloseDeletefile = () => setDeletefileModal(false);

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
  function removeFile(data) {
    console.log(data);
    Setdataitem(data);
    setDeletefileModal(true);
  }

  const myFunc3 = () => {
    console.log(dataItem.url, dataItem.name);
    handleUnpin(dataItem.url, dataItem.name);
  };

  async function handleUnpin(cid, name) {
    let resp = "";
    try {
      resp = await contract.deleteFile(
        cid,
        name + " has been deleted.",
        myaddress + " has deleted the file " + name + ".",
        humanReadableDate
      );

      // console.log("cid ", cid);
    } catch (error) {
      console.log("Error deleting file:", error);
      return;
    }

    setDeletefileModal(false);
    const toastId = toast.loading("Unpinning file...", {
      theme: "dark",
      position: "top-right",
      autoClose: false,
      closeOnClick: false,
      draggable: false,
    });
    try {
      const res = await fetch(`https://api.pinata.cloud/pinning/unpin/${cid}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkZGE4MDRkYi01YjhlLTRiMGYtODg2OC04MWFkYWQwYmQ5MDQiLCJlbWFpbCI6ImtvaGxpYXJ5YW4yMUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiZDdkZTBiOTgyM2NmOTEzZTU0Y2QiLCJzY29wZWRLZXlTZWNyZXQiOiIyMTVhZjhkYmI3OTlmYTY3N2E3OTAyN2ZkNTg1NzcyMjYzN2ZkZjExMTFlYzM5M2Q3ZmI2MGFmODFjODZmNzJhIiwiaWF0IjoxNzEzNTM5OTU4fQ.x5pJ2NKHPiDNU1OQwhsYv26gjKApseewB0QO8z7jJWk`,
        },
      });

      if (res.ok) {
        toast.update(toastId, {
          render: "File successfully unpinned!",
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
        console.log("file unpinned");
        setData([]);
        const allfees = await calculateTransactionCost(resp);
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
  function giveacces(data, addressaccess) {
    // console.log("hete", addressaccess);
    // SetAction("G");
    // console.log(data.name);
    Setdataitem(data);
    setAccessModal(true);
  }
  function removeAccess(data, addressaccess) {
    // if (addressaccess === "") {
    //   toast.error("Please Enter Address", {
    //     theme: "dark",
    //   });
    //   return;
    // }
    console.log("here", addressaccess);
    // SetAction("R");
    // console.log(action);
    Setdataitem(data);
    console.log(data);
    setRemoveAccessModal(true);
  }
  async function handleRemoveAccess(addressaccess, data) {
    console.log("address is ", addressaccess);
    console.log(data.url);
    // myFunc(addressaccess);
    if (data && addressaccess) {
      try {
        console.log("done", data);
        const resp = await contract.removeAccess(
          data.url,
          addressaccess,
          data.name + " access removed for " + addressaccess,
          myaddress + " has removed their files access for " + data.name + ".",
          humanReadableDate
        );
        console.log(addressaccess);
        toast.success("Accesss removed Successfully", {
          theme: "dark",
        });

        setRemoveAccessModal(false);
        const allfees = await calculateTransactionCost(resp);
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
      } catch (error) {
        console.error("Error calling contract.giveAccess:", error);
      }
    } else {
      console.log("No data selected");
    }
  }
  async function handleGiveAccess(addressaccess, data) {
    console.log("address is ", addressaccess);
    console.log(data.url);
    // myFunc(addressaccess);
    if (data && addressaccess) {
      try {
        console.log("done", data);
        const resp = await contract.giveAccess(
          data.url,
          data.name,
          humanReadableDate,
          "128kb",
          addressaccess,
          data.name + " shared with " + addressaccess,
          data.name + "has been shared by " + myaddress
        );
        console.log(addressaccess);
        toast.success("Accesss granted Successfully", {
          theme: "dark",
        });
        setAccessModal(false);

        const allfees = await calculateTransactionCost(resp);
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
      } catch (error) {
        console.error("Error calling contract.giveAccess:", error);
      }
    } else {
      console.log("No data selected");
    }
  }

  async function handleaccessList(url) {
    var list = await contract.getAccesList(url);
    // console.log(list);

    const accessListRows = list.map((item, index) => {
      console.log(item);
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{item[0]}</td>
        </tr>
      );
    });

    const table = (
      <table className="table table-dark table-hover mt-4 ">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Account Numbers</th>
          </tr>
        </thead>
        <tbody>{accessListRows}</tbody>
      </table>
    );

    setAccessList(table);
    setShow(true);
    if (list === undefined || list.length == 0) {
      setAccessList(
        <div>
          <p>No Access List Founded.</p>
        </div>
      );
    }
    <Modal
      data-bs-theme="dark"
      show={show}
      onHide={handleClose}
      animation={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Access List</Modal.Title>
      </Modal.Header>
      <Modal.Body>{accessList}</Modal.Body>
      <Modal.Footer>
        <button onClick={handleClose}>Close</button>
      </Modal.Footer>
    </Modal>;
  }

  const myFunc = (address) => {
    if (address === "") {
      toast.error("Please Enter Address", {
        theme: "dark",
      });
      return;
    }

    console.log(address);
    handleGiveAccess(address, dataItem);
  };

  const myFunc2 = (address) => {
    if (address === "") {
      toast.error("Please Enter Address", {
        theme: "dark",
      });
      return;
    }
    setAccessList([]);
    handleRemoveAccess(address, dataItem);
  };

  async function getTransaction() {
    let transaction = await contract.getTransactions();

    // Check the structure of the transaction data
    const mutableTransactions = Array.from(transaction); // or use [...transaction]

    // console.log(mutableTransactions); // Log the transaction to see its structure
    // Convert to a mutable array if necessary
    setMutableTransactions(mutableTransactions);
    if (mutableTransactions === undefined || mutableTransactions.length == 0) {
      setTransactData(
        <div>
          <p>No Transactions Founded.</p>
        </div>
      );
    } else {
      // Reverse the order of the transaction array
      const transact = mutableTransactions.reverse().map((item, index) => {
        // console.log(item);
        return (
          <tr key={index}>
            <td>{mutableTransactions.length - index}</td> <td>{item[0]}</td>
            <td>{item[1]}</td>
          </tr>
        );
      });

      const table = (
        <table className="table table-dark mt-4">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Transaction Details</th>
              <th scope="col">Timestamp</th>
            </tr>
          </thead>
          <tbody>{transact}</tbody>
        </table>
      );

      setTransactData(table);
    }
    setShowtransModal(true);
  }

  const handleDownload = async (url, filename) => {
    try {
      // Fetch the encrypted file from IPFS
      const decryptionKey = "mySecretKey";
      const response = await fetch(url);
      const encryptedData = await response.text(); // Fetch encrypted content

      // Decrypt the file content
      const decryptedContent = decryptFile(encryptedData, decryptionKey);
      const fileExtension = filename.split(".").pop(); // Get the file extension

      if (!decryptedContent) {
        throw new Error("Decryption failed");
      }

      // Create a Blob from the decrypted content
      const blob = new Blob([decryptedContent], {
        type: "application/octet-stream",
      });

      // Set the filename with the correct extension
      filename = filename || `decrypted_file.${fileExtension}`;

      // Create a download link for the decrypted file
      const link = document.createElement("a");
      const blobUrl = URL.createObjectURL(blob);
      link.href = blobUrl;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl); // Clean up the URL object
    } catch (error) {
      console.error("Download or decryption failed:", error);
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
        setData(
          <div>
            <h1>No Files Founded.</h1>
          </div>
        );
      } else {
        const resp = await contract.SharedTransaction(
          otherAddress,
          myaddress + " have accesed your shared files .",
          humanReadableDate
        );
        const allfees = await calculateTransactionCost(resp);
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
        const imgs = dataArray.map((data, index) => {
          console.log(data);
          return (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{data.name}</td>
              <td>{data.size}</td> {/* Display size in MB */}
              <td>{new Date(data.timeStamp).toLocaleString()}</td>
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
        setData(
          <div>
            <h1>No Files Founded.</h1>
          </div>
        );
      } else {
        const imgs = dataArray.map((data, index) => {
          return (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{data.name}</td>
              <td>{data.size}</td> {/* Display size in MB */}
              <td>{new Date(data.timeStamp).toLocaleString()}</td>
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
                  className="but5"
                  onClick={() => giveacces(data, addressaccess)}
                >
                  Give Access
                </button>
              </td>
              <td>
                <button
                  className="but6"
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
              <td>
                <button
                  className="btn_small1"
                  // onClick={() => handleUnpin(data.url, data.name)}
                  onClick={() => removeFile(data)}
                >
                  Remove File
                </button>
              </td>
            </tr>
          );
        });

        const table = (
          <table className="table mt-4 table-dark ">
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
                <th scope="col">Remove File</th>
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
        show={showtransModal}
        onHide={handletransClose}
        animation={false}
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Transactions Details
            {mutableTransactions && (
              <PDFDownloadLink
                document={
                  <TransactionsPdf
                    transactions={mutableTransactions}
                    myaddress={myaddress}
                  />
                }
                fileName={"Transactions.pdf"}
                className="pdf-download-button"
              >
                <FaFilePdf className="pdf-icon" />
                DOWNLOAD PDF
              </PDFDownloadLink>
            )}
          </Modal.Title>
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
        show={show}
        onHide={handleClose}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Access List</Modal.Title>
        </Modal.Header>
        <Modal.Body>{accessList}</Modal.Body>
        <Modal.Footer>
          <button onClick={handleClose}>Close</button>
        </Modal.Footer>
      </Modal>
      {/* <div>{accessList}</div> */}

      <Modal data-bs-theme="dark" show={accessModal} onHide={HandleCloseAccess}>
        <Modal.Header>
          <Modal.Title>Confirming To Give Access</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are You sure you want to give Access of{" "}
            {dataItem ? dataItem.name : ""} ?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <button onClick={() => myFunc(addressaccess)}>Yes</button>
          <button onClick={HandleCloseAccess}>No</button>
        </Modal.Footer>
      </Modal>

      <Modal
        data-bs-theme="dark"
        show={removeAccessModal}
        onHide={HandleCloseAccess}
      >
        <Modal.Header>
          <Modal.Title>Confirming To Remove Access</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are You sure you want to remove Access of
            {dataItem ? dataItem.name : ""} ?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <button onClick={() => myFunc2(addressaccess)}>Yes</button>
          <button onClick={HandleCloseRemoveAccess}>No</button>
        </Modal.Footer>
      </Modal>
      <Modal
        data-bs-theme="dark"
        show={deletefileModal}
        onHide={HandleCloseDeletefile}
      >
        <Modal.Header>
          <Modal.Title>Confirming To Delete File ?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are You sure you want to delete file ?</p>
        </Modal.Body>
        <Modal.Footer>
          <button onClick={myFunc3}>Yes</button>
          <button onClick={HandleCloseDeletefile}>No</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
