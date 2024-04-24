import React from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
class Nav extends React.Component {
  render() {
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
          <div className="container">
            <Link className="navbar-brand m-auto" to={'/'}>
              Facegram
            </Link>
          </div>
        </nav>
    );
  }
}

export default Nav;
