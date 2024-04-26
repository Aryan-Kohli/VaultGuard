import React from "react";
import "./App.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GetStarted from "./GetStarted.jsx";
import Welcome from "./Welcome.jsx";
export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Welcome />} />
            <Route path={"/getstarted"} element={<GetStarted />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
