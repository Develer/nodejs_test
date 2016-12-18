import React from 'react';

import * as RegisterActions from '../actions/RegisterActions.jsx';
import RegStore from '../stores/RegStore.jsx';

// require('./signin.css');


class Register extends React.Component {
  constructor() {
    super();

    this.state = {
      csrfToken: RegStore.getCSRFTokenReg(),
      login: "",
      password: "",
      registeredData: RegStore.getRegisteredData()
    }

    this.getRegisteredData = this.getRegisteredData.bind(this);
    this.getCSRFTokenReg = this.getCSRFTokenReg.bind(this);
    
    this.changer = this.changer.bind(this);
    
    this.handleLoginChange = this.handleLoginChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    console.log('mount register');
    RegStore.on('change', this.changer);
    RegisterActions.getCSRFTokenReg();
  }

  changer() {
    // Check registeredData property state
    if (Object.keys(this.state.registeredData).length === 0 &&
        this.state.registeredData.constructor === Object) {
      this.getRegisteredData();
      if (this.state.registeredData.status == 'done') {
        this.props.router.replace('/login');
      }
    } else if (this.state.registeredData.status == 'done') {
      this.props.router.replace('/login');
    } else {
      console.log(this.state.registeredData);
    }
    
    // Check csrfToken property state
    if (this.state.csrfToken == "") {
      this.getCSRFTokenReg();
    }
  }

  componentWillUnmount() {
    console.log('unmount register');
    RegStore.removeListener('change', this.changer);
  }

  getCSRFTokenReg() {
    this.setState({
      csrfToken: RegStore.getCSRFTokenReg()
    });
  }

  getRegisteredData() {
    this.setState({
      registeredData: RegStore.getRegisteredData()
    });
  }

  handleLoginChange(event) {
    this.setState({login: event.target.value});
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    var data = {
      csrfToken: this.state.csrfToken,
      login: this.state.login,
      password: this.state.password
    }
    RegisterActions.register(data);
  }

  render() {
    const { csrfToken } = this.state;

    return (
      <div class="container">
        <form class="form-signin" onSubmit={ this.handleSubmit }>
          <input type="hidden" name="_csrf" value={ csrfToken }/>
          <h2 class="form-signin-heading">Sing Up</h2>
          <label for="inputLogin" class="sr-only">Login</label>
          <input type="text" id="inputLogin" class="form-control" placeholder="Login" required="" autoFocus=""
                 onChange={this.handleLoginChange}
          />
          <label for="inputPassword" class="sr-only">Password</label>
          <input type="password" id="inputPassword" class="form-control" placeholder="Password" required=""
                 onChange={this.handlePasswordChange}
          />
          <button class="btn btn-lg btn-primary btn-block" type="submit">Sign Up</button>
        </form>
      </div>
    )
  }
}

export default Register;
