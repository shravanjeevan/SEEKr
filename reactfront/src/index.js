import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import register from "./Register";

const rootElement = document.getElementById("root");
const testElement = document.getElementById("test");

ReactDOM.render(
  <React.StrictMode>
    <App />

  </React.StrictMode>,
  rootElement
);

ReactDOM.render(
  <React.StrictMode>
    <register />

  </React.StrictMode>,
  testElement
);
