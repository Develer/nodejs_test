import axios from 'axios';

import dispatcher from '../dispatcher.jsx';

export function createPlotExp(plot_exp) {
  dispatcher.dispatch({
    type: "CREATE_PLOT",
    plot_exp
  });
}

export function deletePlotExp(id) {
  dispatcher.dispatch({
    type: "DELETE_PLOT",
    id
  });
}

export function reloadPlotExps() {
  axios.post('http://127.0.0.1:8081/charts/list', {
    id: 1,
  })
  .then((response) => {
    console.log(response);
    var plot_exps = response.data.plots.map((plot) => {
      return {id: plot.id, plot_exp: plot.plot_exp}
    });
    dispatcher.dispatch({type: "RECEIVE_PLOTS", plot_exps: plot_exps});
  })
  .catch((error) => {
    console.log(error);
  });

  // dispatcher.dispatch({type: "FETCH_PLOTS"});
}