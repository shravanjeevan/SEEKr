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
            <hr 
            style={{
                backgroundColor: '#F5F9FC',
                height: 3
            }}
        />
      </nav>  
    )
  }
}

export default Header;
