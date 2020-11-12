import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import Logo from './Logo';

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
        <hr
        style={{

            height: 2
        }}
        />
      </header>
      
     
    )
  }
}

export default Header;