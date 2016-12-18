import React from 'react';

import PlotList from '../components/PlotList.jsx';
import Graph from '../components/Graph.jsx';

import * as LoginActions from '../actions/LoginActions.jsx';
import LoginStore from '../stores/LoginStore.jsx';

require('../src/css/offcanvas.css');
require('../src/css/Graph.css');
require('../src/js/offcanvas.js');


class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      plot_id: null,
      user_id: null,
      plot: null
    };
  }

  changeChart(data) {
    this.setState({
      plot_id: data.plot_id,
      user_id: data.user_id,
      plot: data.plot
    });
  }

  onPlotSelect(data) {
    this.setState({
      plot_id: data.plot_id,
      user_id: data.user_id,
      plot: data.plot
    });
  }

  render() {
    return (
      <div class="container">

        <div class="row row-offcanvas row-offcanvas-right">

          <div class="col-xs-12 col-sm-9">
            <p class="pull-right visible-xs">
              <button type="button" class="btn btn-primary btn-xs" data-toggle="offcanvas">Toggle nav</button>
            </p>
            <Graph changeChart={this.changeChart.bind(this)} chart={this.state}/>
          </div>

          <div class="col-xs-6 col-sm-3 sidebar-offcanvas" id="sidebar">
            <PlotList onPlotSelect={this.onPlotSelect.bind(this)}/>
          </div>

        </div>

      </div>
    )
  }
}

export default Dashboard;
