import React from "react";
import "./NavBar.css"


// Depending on the current path, this component sets the "active" class on the appropriate navigation link item
function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href="/">
        LinkedUp
      </a>
      <ul>
      <li className="submenu">  <a> Dashboard </a> 
          
      </li>
      <li>  <a> Job Matching </a> </li>
      <li> <a href="/account"> Account </a> </li>
      <li > <a href="/login">  Login </a>   </li>

     </ul>
    </nav>
  );
}

export default Navbar;
