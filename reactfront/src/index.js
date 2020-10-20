import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import Signup from "./Register";

const rootElement = document.getElementById("root");
const testElement = document.getElementById("test");
var cors = require('cors')

app.use(cors())
ReactDOM.render(
  <React.StrictMode>
    <App />

  </React.StrictMode>,
  rootElement
);

ReactDOM.render(
  <React.StrictMode>
    <Signup />

  </React.StrictMode>,
  testElement
);
