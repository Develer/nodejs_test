import axios from 'axios';

import dispatcher from '../dispatcher.jsx';


export function createPlotExp(user_id, plot_exp) {
  axios.post('http://127.0.0.1:8081/charts/create', {
    user_id: user_id,
    plot_exp: plot_exp
  })
  .then((response) => {
    var data = response.data;
    dispatcher.dispatch({
      type: "CREATE_PLOT",
      data: {
        plot_id: data.plot_id,
        user_id: data.user_id,
        plot: data.plot
      }
    });
  })
  .catch((error) => {
    console.log('ERROR createPlotExperror: ', error);
  });
}

export function updatePlotExp(plot_id, user_id, plot_exp) {
  axios.post('http://127.0.0.1:8081/charts/update', {
    plot_id: plot_id,
    user_id: user_id,
    plot_exp: plot_exp
  })
  .then((response) => {
    var data = response.data;
    dispatcher.dispatch({
      type: "UPDATE_PLOT",
      data: {
        plot_id: data.plot_id,
        user_id: data.user_id,
        plot: data.plot
      }
    });
  })
  .catch((error) => {
    console.log('ERROR updatePlotExp error: ', error);
  });
}

export function deletePlotExp(plot_id, user_id) {
  axios.post('http://127.0.0.1:8081/charts/delete', {
    plot_id: plot_id,
    user_id: user_id
  })
  .then((response) => {
    var data = response.data;
    dispatcher.dispatch({
      type: "DELETE_PLOT",
      plot_id: data.plot_id
    });
  })
  .catch((error) => {
    console.log('ERROR updatePlotExp error: ', error);
  });
}

export function reloadPlotExps() {
  axios
  .post('http://127.0.0.1:8081/charts/list', {id: 1})
  .then((response) => {
    var plot_exps = response.data.plots.map((plot) => {
      return {plot_id: plot.id, user_id: plot.user_id, plot_exp: plot.plot_exp};
    });
    dispatcher.dispatch({type: "RECEIVE_PLOTS", plot_exps: plot_exps});
  })
  .catch((error) => {
    console.log(error);
  });

}