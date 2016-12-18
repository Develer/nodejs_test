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
    switch(action.type) {
      case "GET_CSRF_REG_TOKEN": {
        this.csrfToken = action.csrfToken;
        this.emit('change');
        break;
      }
      case "REG_DONE": {
        this.registeredData = action.data;
        this.emit('change');
        break;
      }
    }
  }
}

const regStore = new RegStore;
dispatcher.register(regStore.handleAction.bind(regStore));

export default regStore;
