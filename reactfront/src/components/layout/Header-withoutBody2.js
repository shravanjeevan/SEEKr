import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import Logo from './Logo';
import Dropdown from 'react-dropdown';
import DropdownButton from 'react-dropdown';

class Header extends Component {
  componentDidMount() {
  }

  render() {
    return (
      <nav>
          <br></br>
            <div className="brand header-brand">
              <h1 className="m-0">
                <Link to="/">
                  <Logo /> {this.props.title}
                  SEEKr
                </Link>
              </h1>
            </div>
            <div class="row">
            <div class="col-lg-12">
                <button class="btn btn-secondary float-right"> My Account</button>
            </div>
</div>
        <hr
        style={{

            height: 2
        }}
        />
      </nav>
      
     
    )
  }
}

export default Header;
