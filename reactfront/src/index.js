import React, { Component, useState,useEffect } from "react";
import ReactDOM from "react-dom";
import cookie from "react-cookies";
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

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

const token = "yo"
cookie.save("t",token,{path:"/"})
const rootElement = document.getElementById("root");
const testElement = document.getElementById("test");
const loginElement = document.getElementById("login");


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
//     <Login t = {token}/>

//   </React.StrictMode>,
//   loginElement
// );


