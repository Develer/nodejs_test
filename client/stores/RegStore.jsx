import EventEmmiter from 'events';

import dispatcher from '../dispatcher.jsx';


class RegStore extends EventEmmiter {
  constructor(props) {
    super(props);

    this.registeredData = {};
    this.csrfToken = "";
  }

  getCSRFTokenReg() {
    return this.csrfToken;
  }

  getRegisteredData() {
    return this.registeredData;
  }
  
  handleAction(action) {
    console.log("REG ACTION!");
    switch(action.type) {
      case "GET_CSRF_REG_TOKEN": {
        console.log("GET_CSRF_REG_TOKEN");
        this.csrfToken = action.csrfToken;
        this.emit('change');
        break;
      }
      case "REG_DONE": {
        console.log("REG_DONE!!!");
        this.registeredData = action.data;
        this.emit('change');
        break;
      }
      case "REG_REDIRECT": {
        console.log("REG_REDIRECT");
        break;
      }
    }
  }
}

const regStore = new RegStore;
dispatcher.register(regStore.handleAction.bind(regStore));

export default regStore;
