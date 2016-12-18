import axios from 'axios';

import dispatcher from '../dispatcher.jsx';


export function getCSRFTokenReg() {
  axios.get('http://127.0.0.1:8081/register').then((response) => {
    var csrfToken = response.data.csrfToken;
    dispatcher.dispatch({
      type: "GET_CSRF_REG_TOKEN",
      csrfToken: csrfToken
    });
  }).catch((error) => {
    console.log('getCSRFToken reg action error: ', error);
  });
}

export function register(data) {
  axios.post('http://127.0.0.1:8081/register', data)
  .then((response) => {
    dispatcher.dispatch({
      type: "REG_DONE",
      data: response.data
    });
  })
  .catch((error) => {
    console.log("register action error: ", error);
  });
}
