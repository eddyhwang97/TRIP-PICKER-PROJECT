import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import App from "./App";
import { DashBoard, EditTrip, Main } from "./views";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Main />} />
        <Route path="dashboard" element={<DashBoard />} />
        <Route path="edittrip" element={<EditTrip />} />
      </Route>
    </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
