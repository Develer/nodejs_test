import axios from 'axios';

import dispatcher from '../dispatcher.jsx';


export function getCSRFTokenLogin() {
  console.log('getCSRFToken login action');
  
  axios.get('http://127.0.0.1:8081/login').then((response) => {
    var csrfToken = response.data.csrfToken;
    dispatcher.dispatch({
      type: "GET_CSRF_LOGIN_TOKEN",
      csrfToken: csrfToken
    });
  }).catch((error) => {
    console.log(error);
  });
}

export function login(data) {
  console.log("login action");
  
  axios.post('http://127.0.0.1:8081/login', data)
  .then((response) => {
    console.log('login action response:', response);
    // console.log(response.getResponseHeader('Set-Cookie'));
    dispatcher.dispatch({
      'type': "LOGIN_DONE",
      'data': response.data
    });
    // store session in browser sessionStorage
    sessionStorage.setItem('nodejs_session_id', response.data.session_id);
  })
  .catch((error) => {
    console.log('Login action error:', error);
    // dispatcher.dispatch({
    //   'type': 'LOGIN_ERR',
    //   'error': error
    // });
  });

  // var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
  // xmlhttp.addEventListener("load", function() {
  //   console.log("load", xmlhttp.getResponseHeader('my_cookie'));
  // });
  // xmlhttp.open("POST", "http://127.0.0.1:8081/login");
  // xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  // xmlhttp.send(JSON.stringify(data));
}
