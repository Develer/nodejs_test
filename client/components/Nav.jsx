import React from 'react';
import { Link } from 'react-router';

class Nav extends React.Component {
  navigate() {
    this.props.navigate();
  }

  render() {
    return (
      <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="container-fluid">
          <div className="navbar-header">
            <Link className="navbar-brand"
                  to="/dashboard"
                  onClick={ this.navigate.bind(this) }>ChartHub</Link>
          </div>
          <div id="navbar" className="navbar-collapse collapse">
            <ul className="nav navbar-nav navbar-right">
              <li><Link to='/dashboard'>Dashboard</Link></li>
              {/*<li><Link to='/login'>Login</Link></li>
              <li><Link to='/register'>Register</Link></li>*/}
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}

export default Nav;
