import React from "react";
import "./Welcome.css";

// import React from "react";
import g1 from "./assets/g1.png";
import g2 from "./assets/g2.png";
import g3 from "./assets/g3.png";
import g6 from "./assets/g6.png";
import img2 from "./assets/img2.jpg";
import img3 from "./assets/img3.jpg";
import img4 from "./assets/img4.jpg";
import metamask from "./assets/metamask.jpg";
import { useNavigate } from "react-router-dom";
export default function Welcome() {
  const navigate = useNavigate();
  function ChangeScreen() {
    navigate("/getstarted");
  }
  return (
    <div className="wp">
      <div className="header">
        <div className="logo">
          <img src={g1} alt="" />
          <h1>VaultGuard</h1>
        </div>
        <div className="nav">
          <p>Home</p>
          <a href="#meta">
            <p>Extension</p>
          </a>
          <a href="#plans">
            <p>Plans</p>
          </a>
          <a href="#about">
            {" "}
            <p>About Us</p>
          </a>
        </div>
        <div className="butd">
          <button className="but" onClick={() => ChangeScreen()}>
            Get Started
          </button>
        </div>
      </div>
      <div className="section">
        <div className="container">
          <h1 className="blu">Our</h1>
          <h1>Model</h1>
          <p>
            provides a state-of-the-art platform utilizing{" "}
            <span className="bt"> Blockchain Technology</span> <br />
            to protect your data. With our solution, you can securely store and
            share data, <br />
            easily monitor version history, control access selectively &amp;
            track file access activity <br />
            to see who accessed what.{" "}
          </p>
        </div>
        <div className="folder">
          <img src={g2} alt="" />
        </div>
      </div>
      <div className="mid" id="meta">
        <div className="main">
          <h1 className="heading">
            <span className="g">G</span>
            <span className="o1">o</span>
            <span className="o2">o</span>
            <span className="g1">g</span>
            <span className="l">l</span>
            <span className="e">e</span>
          </h1>
          <h1 className="heading-1">Extension</h1>
          <div className="box1">
            <p className="text">
              Our model requires the <span className="t1">METAMASK </span>
              Chrome extension to operate and will not <br />
              function without it. To use our model, please follow these steps
              to download and install the extension:
            </p>
          </div>
          <div className="box2">
            <div className="insidebox21">
              <div className="text21">
                <h1>STEP1:</h1>
                <h4>
                  Click on{" "}
                  <a
                    href="https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
                    className="an"
                  >
                    METAMASK EXTENSION
                  </a>{" "}
                  to download the extension
                </h4>
              </div>
              <img className="img2" src={img2} alt="pngg" />
            </div>
            <div className="insidebox22">
              <div className="text22">
                <h1>STEP2:</h1>
                <h4>Click on ADD TO CHROME BUTTON</h4>
              </div>
              <img className="img3" src={img3} alt="pnggg" />
            </div>
            <div className="insidebox23">
              <div className="text23">
                <h1>STEP3:</h1>
                <h4>Wait untill this page arrives!!</h4>
              </div>
              <img className="img4" src={img4} alt="jpegg" />
            </div>
          </div>
        </div>
      </div>
      <div className="sub" id="plans">
        <h1 className="subblu">Subcription</h1>
        <h1 className="subwh">Details</h1>
        <div className="wrapper">
          <div className="card">
            <h3>Basic</h3>
            <h1>
              Free <span>/Month</span>
            </h1>
            <ul>
              <li>
                <i className="fa-solid fa-square-check" /> Storage Limited to
                5gb.
              </li>
              <li>
                <i className="fa-solid fa-square-check" /> Users can Give Access
                of files to maximum 3 users.
              </li>
            </ul>
            <a href="" className="sub1">
              Choose Plan
            </a>
          </div>
          <div className="card">
            <h3>Premium</h3>
            <h1>
              ₹500 <span>/Month</span>
            </h1>
            <ul>
              <li>
                <i className="fa-solid fa-square-check" /> Storage Limited to
                50gb.
              </li>
              <li>
                <i className="fa-solid fa-square-check" /> Users can Give Access
                of files to maximum 10 users.
              </li>
              <li>
                <i className="fa-solid fa-square-check" /> Can View only last 5
                Transactions.
              </li>
            </ul>
            <a href="" className="sub2">
              Choose Plan
            </a>
          </div>
          <div className="card">
            <h3>Elite</h3>
            <h1>
              ₹1000 <span>/Month</span>
            </h1>
            <ul>
              <li>
                <i className="fa-solid fa-square-check" /> Storage Limited to
                500gb.
              </li>
              <li>
                <i className="fa-solid fa-square-check" /> Users can Give Access
                of files to maximum 50 users.
              </li>
              <li>
                <i className="fa-solid fa-square-check" /> Can View only last 15
                Transactions.
              </li>
            </ul>
            <a href="" className="sub2">
              Choose Plan
            </a>
          </div>
        </div>
      </div>
      <div className="about" id="about">
        <h2 className="blu">Team</h2>
        <h2 className="wit">Shareefzaade</h2>
      </div>
      <img src={g3} className="team" alt="" />
    </div>
  );
}
