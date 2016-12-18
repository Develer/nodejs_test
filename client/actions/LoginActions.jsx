import axios from 'axios';

import dispatcher from '../dispatcher.jsx';


export function getCSRFTokenLogin() {
  axios.get('http://127.0.0.1:8081/login').then((response) => {
    var csrfToken = response.data.csrfToken;
    dispatcher.dispatch({
      type: "GET_CSRF_LOGIN_TOKEN",
      csrfToken: csrfToken
    });
  }).catch((error) => {
    console.log('getCSRFToken login action error:', error);
  });
}

export function login(data) {
  axios.post('http://127.0.0.1:8081/login', data)
  .then((response) => {
    dispatcher.dispatch({
      'type': "LOGIN_DONE",
      'data': response.data
    });
    // // store session in browser sessionStorage
    // sessionStorage.setItem('nodejs_session_id', response.data.session_id);
  })
  .catch((error) => {
    console.log('Login action error:', error);
  });
}
