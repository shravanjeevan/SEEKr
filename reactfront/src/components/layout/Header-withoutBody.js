import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import Logo from './Logo';
//import { Divider } from 'react-native-elements';

class Header extends Component {
  componentDidMount() {
  }

  render() {
    return (
      <header className="site-header">
        <div className="container">
            <div className="brand header-brand">
              <h1 className="m-0">
                <Link to="/">
                  <Logo /> {this.props.title}
                  SEEKr
                </Link>
              </h1>
            </div>
        </div>
      </header>
     
    )
  }
}

export default Header;
