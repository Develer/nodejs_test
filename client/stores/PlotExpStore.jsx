import EventEmmiter from 'events';

import dispatcher from '../dispatcher.jsx';


class PlotExpStore extends EventEmmiter {
  constructor(props) {
    super(props);

    this.plot_exps = [];
  }

  createPlotExp(plot_exp) {
    const id = Date.now();
    
    this.plot_exps.push({
      id,
      plot_exp
    });

    this.emit('change');
  }

  getAll() {
    return this.plot_exps;
  }

  handleAction(action) {
    console.log("Action", action);
    switch(action.type) {
      case "CREATE_PLOT": {
        this.createPlotExp(action.plot_exp);
      }
      case "RECEIVE_PLOTS": {
        this.plot_exps = action.plot_exps;
        this.emit('change');
      }
    }
  }
}

const plotExpStore = new PlotExpStore;
dispatcher.register(plotExpStore.handleAction.bind(plotExpStore));

export default plotExpStore;
