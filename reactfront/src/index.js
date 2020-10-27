import React from "react";
import ReactDOM from "react-dom";
import Demo from "./Demo";
import App from "./App";
import Signup from "./Register";
import Login from "./Login";

const Routing =()=> (
  <Router>
      <Route exact path="/" component={App}></Route>
      <Route path="/register" component={Signup} ></Route>
      <Route path="/login" component={Login} ></Route>
  </Router>
)


const rootElement = document.getElementById("root");
const testElement = document.getElementById("test");
const loginElement = document.getElementById("login");

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

ReactDOM.render(
  <React.StrictMode>
    <Login />

     <Demo />

  </React.StrictMode>,
  loginElement
);
