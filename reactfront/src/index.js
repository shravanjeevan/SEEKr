import React from "react";
import ReactDOM from "react-dom";
import Demo from "./Demo";
import App from "./App";
import Signup from "./Register";
import Login from "./Login";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

const Routing =()=> (
  <Router>
      <Route exact path="/" component={App}></Route>
      <Route path="/register" component={Signup} ></Route>
      <Route path="/login" component={Login} ></Route>
  </Router>
)


const rootElement = document.getElementById("root");


ReactDOM.render(
  <React.StrictMode>
    <Routing />

  </React.StrictMode>,
  rootElement
);

// ReactDOM.render(
//   <React.StrictMode>
//     <Signup />

//   </React.StrictMode>,
//   testElement
// );

// ReactDOM.render(
//   <React.StrictMode>
//     <Login />

//      <Demo />

//   </React.StrictMode>,
//   loginElement
// );
