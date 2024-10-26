import Upload2 from "./artifacts/contracts/Upload2.sol/Upload2.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import "./GetStarted.css";
import logo from "./assets/g1.png";

function GetStarted() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const provider = new ethers.BrowserProvider(window.ethereum);

    const loadProvider = async () => {
      if (provider) {
        await provider.send("eth_requestAccounts", []);
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        const signer = await provider.getSigner();
        // console.log(signer);
        const address = signer.address;
        setAccount(address);
        let contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

        const contract = new ethers.Contract(
          contractAddress,
          Upload2.abi,
          signer
        );
        console.log(contract);
        setContract(contract);
        setProvider(provider);
      } else {
        console.error("Metamask is not installed");
      }
    };
    provider && loadProvider();
  }, []);
  return (
    <>
      {/* {!modalOpen && (
        <button className="sharebtn" onClick={() => setModalOpen(true)}>
          Share
        </button>
      )}
      {modalOpen && (
        <Modal setModalOpen={setModalOpen} contract={contract}></Modal>
      )} */}
      <div className="App">
        <div className="maintitleContainer">
          {/* <h1 className="maintitle">Vault Guard</h1> */}
          <img src={logo} className="lg"></img>
        </div>
        <div className="accountheadContainer">
          <h1 className="accounthead">Account : </h1>
          <h1 className="accountNum">{account ? account : "NOT CONNECTED"}</h1>
        </div>
        <FileUpload
          account={account}
          contract={contract}
          provider={provider}
        ></FileUpload>
        <Display
          account={account}
          myaddress={account}
          contract={contract}
        ></Display>
      </div>
    </>
  );
}

export default GetStarted;
