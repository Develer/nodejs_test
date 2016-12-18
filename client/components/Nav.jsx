import React from 'react';
import { Link } from 'react-router';

class Nav extends React.Component {
  navigate() {
    this.props.navigate();
  }

  render() {
    return (
      <nav class="navbar navbar-fixed-top navbar-inverse">
        <div class="container">
          <div class="navbar-header">
            <Link className="navbar-brand"
                  to="/dashboard"
                  onClick={ this.navigate.bind(this) }>ChartHub</Link>
          </div>
          <div id="navbar" class="collapse navbar-collapse">
            <ul class="nav navbar-nav">
              <li><Link class="active" to='/dashboard'>Dashboard</Link></li>
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
