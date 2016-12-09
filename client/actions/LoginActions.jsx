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
    console.log('response:', response);
    dispatcher.dispatch({
      type: "LOGIN_DONE",
      data: response.data
    });
  })
  .catch((error) => {
    console.log(error);
  });

  // 
}
