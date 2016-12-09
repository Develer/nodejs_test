import axios from 'axios';

import dispatcher from '../dispatcher.jsx';


export function getCSRFToken() {
  console.log('getCSRFToken action');
  axios.get('http://127.0.0.1:8081/register').then((response) => {
    var csrfToken = response.data.csrfToken;
    dispatcher.dispatch({
      type: "GET_CSRF_TOKEN",
      csrfToken: csrfToken
    });
  }).catch((error) => {
    console.log(error);
  });
}

export function register(data) {
  console.log("register action");
  axios.post('http://127.0.0.1:8081/register', data)
  .then((response) => {
    // console.log('response:', response);
    dispatcher.dispatch({
      type: "REG_DONE",
      data: response.data
    });
  })
  .catch((error) => {
    console.log(error);
  });

  // 
}
