import React from 'react';

import * as LoginActions from '../actions/LoginActions.jsx';
import LoginStore from '../stores/LoginStore.jsx';

// require('./signin.css');

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      csrfToken: LoginStore.getCSRFTokenLogin(),
      login: "",
      password: "",
      session: LoginStore.getSession()
    }

    this.getSession = this.getSession.bind(this);
    this.getCSRFToken = this.getCSRFToken.bind(this);
    
    this.changer = this.changer.bind(this);
    
    this.handleLoginChange = this.handleLoginChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    console.log('mount login');
    LoginStore.on('change', this.changer);
    LoginActions.getCSRFTokenLogin();
  }

  changer() {
    console.log("changer session:", this.state.session);
    // Check session property state
    if (Object.keys(this.state.session).length === 0 &&
        this.state.session.constructor === Object) {
      this.getSession();
      if (Object.keys(this.state.session).length > 0) {
        this.props.router.replace('/dashboard');
      }
    } else if (Object.keys(this.state.session).length > 0) {
      this.props.router.replace('/dashboard');
    } else {
      console.log("error", this.state.session);
    }
    
    // Check csrfToken property state
    if (this.state.csrfToken == "") {
      this.getCSRFToken();
    }
  }

  componentWillUnmount() {
    console.log('unmount login');
    LoginStore.removeListener('change', this.changer);
  }

  getCSRFToken() {
    this.setState({
      csrfToken: LoginStore.getCSRFTokenLogin()
    });
  }

  getSession() {
    this.setState({
      session: LoginStore.getSession()
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
    LoginActions.login(data);
  }

  render() {
    const { csrfToken } = this.state;

    return (
      <div className="container">
        <form className="form-signin" onSubmit={ this.handleSubmit }>
          <input type="hidden" name="_csrf" value={ csrfToken }/>
          <h2 className="form-signin-heading">Login</h2>
          <label for="inputEmail" className="sr-only">Login</label>
          <input type="text" id="inputEmail" className="form-control" placeholder="Email address" required="" autoFocus=""
                 onChange={this.handleLoginChange}/>
          <label for="inputPassword" className="sr-only">Password</label>
          <input type="password" id="inputPassword" className="form-control" placeholder="Password" required=""
                 onChange={this.handlePasswordChange}/>
          <button className="btn btn-lg btn-primary btn-block" type="submit">LogIn</button>
        </form>
      </div>
    )
  }
}

export default Login;
