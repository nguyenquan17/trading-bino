import React from "react";
import "@fontsource/open-sans"; // Defaults to weight 400
import "@fontsource/open-sans/400.css"; // Specify weight

import ReactDOM from "react-dom/client";
import "./assets/css/Index.css";
import './lib/AxiosConfig';
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("quarax") as HTMLElement
);
root.render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);
