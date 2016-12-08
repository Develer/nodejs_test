import React from 'react';
import { Link } from 'react-router';

class Home extends React.Component {
  render() {
    return (
      <div class="container">
        <div class="form-signin">
          <Link class="btn btn-lg btn-primary btn-block" to='/login'>Login</Link>
          <Link class="btn btn-lg btn-primary btn-block" to='/register'>Register</Link>
        </div>
      </div>
    );
  }
}

export default Home;