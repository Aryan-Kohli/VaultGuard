import React from "react";
import { useEffect, useState } from "react";

export default function Display({ account, contract }) {
  const [data, setData] = useState([]);
  async function getdata() {
    let dataArray;
    const otherAddress = document.getElementsByName("addresses")[0].value;
    if (otherAddress) {
      dataArray = await contract.display(otherAddress);
      console.log(dataArray);
    } else {
      dataArray = await contract.display(account);
      console.log(dataArray);
    }

    const isEmpty = Object.keys(dataArray).length === 0;
    if (isEmpty) {
    } else {
      console.log(dataArray[0].url);
      console.log(dataArray[0].name);
      const imgs = dataArray.map((data, index) => {
        return (
          <a
            href={`https://gateway.pinata.cloud/ipfs/${data.url}`}
            target="_blank"
            key={index}
          >
            <div key={index} className="boxx">
              <h5>{data.name}</h5>
            </div>
          </a>
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
    </div>
  );
}
