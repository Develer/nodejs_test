import React from 'react';

class Register extends React.Component {
  render() {
    return (
      <div class="container">
        <form class="form-signin">
          <h2 class="form-signin-heading">Sing Up</h2>
          <label for="inputEmail" class="sr-only">Email address</label>
          <input type="email" id="inputEmail" class="form-control" placeholder="Email address" required="" autoFocus=""/>
          <label for="inputPassword" class="sr-only">Password</label>
          <input type="password" id="inputPassword" class="form-control" placeholder="Password" required=""/>
          <button class="btn btn-lg btn-primary btn-block" type="submit">Sign Up</button>
        </form>
      </div>
    )
  }
}

export default Register;
