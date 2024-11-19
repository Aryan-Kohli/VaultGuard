import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { IoMdInformationCircleOutline } from "react-icons/io";
import { useState } from 'react';
import "./Instructions.css";



const Instructions = () => {

    const [showInstructModal, setShowInstructModal] = useState(false);

    const handleInstructClose = () => setShowInstructModal(false);
    const handleInstructShow = () => setShowInstructModal(true);

    return (
        <div>
            <button className='float-btn' onClick={handleInstructShow}>
                <IoMdInformationCircleOutline size={40} />
            </button>
        <Modal
         data-bs-theme="dark"
         show = {showInstructModal} onHide = {handleInstructClose} animation = {false}>
          <Modal.Header closeButton>
            <Modal.Title>Instructions</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div className="info">
            <h3 className="note-header">Welcome to the page !!</h3>
            <p className="note">
            Where all the action takes place! The field above displays your
            current account number. Here, you have the option to send or receive
            files. By adding a recipient&apos;s address, you can view files that
            another user has shared with you. Alternatively, by adding a sender&apos;s
            address, you can grant or revoke access to specific files.
            </p>
            <h3 className="note-header">Instructions..</h3>
            <p className="note">
            1 <b>Uploading a File:</b> Click *Upload file*, select a file from your PC.
            Wait briefly, approve the gas fee in MetaMask, and you’ll receive a confirmation
            once the file is successfully uploaded. To view your files, click *Search Files*
            for a complete list of uploaded files. <br />
            2 <b>Managing Access: </b>To grant or revoke access to a file, enter the recipient’s
            address and click *Give Access* next to the file. Confirm the action, approve the
            transaction in MetaMask, and check *Get Transactions* for confirmation. <br />
            3 <b>Accessing Shared Files:</b> To view files shared with you, enter the sender’s
            address in *Enter Sender’s Address* and click *List All Files* to see all files
            they have given you access to.
          </p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button onClick={handleInstructClose}>
                Close
            </button>
          </Modal.Footer>
        </Modal>
        </div>
       
    );
};


export default Instructions;   