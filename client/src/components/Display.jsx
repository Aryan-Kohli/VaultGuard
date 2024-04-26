import React from "react";
import { useEffect, useState } from "react";
import "./Display.css"; 
import { MdDocumentScanner } from "react-icons/md";
import Modal from 'react-modal';

export default function Display({ account, contract }) {
  const [data, setData] = useState([]);
  const [transactData, setTransactData] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const [addressaccess, setAddressAccess] = useState("");
  const [accessList, setAccessList] = useState([]);
  const [selectedData, setSelectedData] = useState(null);

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

  async function handleGiveAccess(addressaccess,data) {
    console.log(addressaccess);
    console.log(data);
    if (data && addressaccess) {
      try {
        console.log("done", data);
        await contract.giveAccess(data.url, data.name, humanReadableDate, "128kb", addressaccess, data.name + " shared with " + addressaccess);
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
   const accesslist = list.map((item, index) => {
    return (
      <ul key = {index}>
        <li>{item[0]}</li>
      </ul>
    )
   })
    setAccessList(accesslist);
  }
const myFunc = (address) => {
  console.log(address);
}

  async function getTransaction() {
    let transaction = await contract.getTransactions();
    // (transaction.map((item) => {
    //   console.log(item[0]);
    // }));
    const transact = transaction.map((item, index) => {
        return (
          <ul key = {index}>
            <li>{item[0]}</li>
          </ul>
        )
    });
    setTransactData(transact);
  }
      const timestamp = Date.now();
      const dateObject = new Date(timestamp);
      const humanReadableDate = dateObject.toLocaleString();

  async function getdata() {
    let dataArray;
    const otherAddress = document.getElementsByName("addresses")[0].value;
    if (otherAddress) {
      dataArray = await contract.display(otherAddress);
      console.log(dataArray);
    } else {
      dataArray = await contract.getMyFiles();
      console.log(dataArray);
    }

    const isEmpty = Object.keys(dataArray).length === 0;
    if (isEmpty) {
    } else {
      const imgs = dataArray.map((data, index) => {
        return (
          <div key = {index} className="file">
            <p>{data.name}</p>
            <p>{data.size}</p>
            <p>{data.timeStamp}</p>
            <MdDocumentScanner className="icons" onClick={() => {
              window.open(`https://gateway.pinata.cloud/ipfs/${data.url}`, "_blank");
            }} />
            <div>
              <button className="btn_small" onClick={() => handleGiveAccess(addressaccess,data)}>Give Access</button>
            </div> 
            <button className="btn_small" onClick={() => handleaccessList(data.url)}>GetAccessList</button>
          </div>
        );
      });
      setData(imgs);
    }
  }
  return (
    <div className="displayImgdiv">
      <h1>IMAGES DATA</h1>
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
      <button className = "btn" onClick={getTransaction}>Get Transactions</button>
      <div className="transactionDiv">{transactData}</div>
      <input className="addressinput" type="text" onChange={e => setAddressAccess(e.target.value)} placeholder="Enter address to give access" />
      <button className="btn_small" onClick={() => myFunc(addressaccess)}>Confirm Address</button>
      <h4>AccessList</h4>
      <div>{accessList}</div>
      </div>
  );
}
