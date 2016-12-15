import EventEmmiter from 'events';

import dispatcher from '../dispatcher.jsx';


class PlotExpStore extends EventEmmiter {
  constructor(props) {
    super(props);

    this.plot_exps = [];
  }

  createPlotExp(plot_id, user_id, plot) {
    this.plot_exps.push({
      plot_id: plot_id,
      user_id: user_id,
      plot_exp: plot
    });
    this.emit('change');
  }

  updatePlotExp(plot_id, user_id, plot) {
    for (var i = 0; i < this.plot_exps.length; i++) {
      if (this.plot_exps[i].plot_id == plot_id) {
        this.plot_exps[i].plot_exp = plot;
        // console.log('updatePlotExp: ', this.plot_exps[i]);
        this.emit('change');
        // break;
      }
    }
  }

  deletePlotExp(plot_id) {
    for (var i = 0; i < this.plot_exps.length; i++) {
      if (this.plot_exps[i].plot_id == plot_id) {
        delete this.plot_exps[i];
        break;
      }
    }
    this.emit('change');
  }

  getAll() {
    return this.plot_exps;
  }

  handleAction(action) {
    switch(action.type) {
      case "CREATE_PLOT": {
        this.createPlotExp(
          action.data.plot_id, action.data.user_id, action.data.plot);
        break;
      }
      case "UPDATE_PLOT": {
        this.updatePlotExp(
          action.data.plot_id, action.data.user_id, action.data.plot);
        break;
      }
      case "DELETE_PLOT": {
        this.deletePlotExp(action.plot_id);
        break;
      }
      case "RECEIVE_PLOTS": {
        this.plot_exps = action.plot_exps;
        this.emit('change');
        break;
      }
    }
  }
}

const plotExpStore = new PlotExpStore;
dispatcher.register(plotExpStore.handleAction.bind(plotExpStore));

export default plotExpStore;
