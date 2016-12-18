import React from 'react';

import PlotList from '../components/PlotList.jsx';
import Graph from '../components/Graph.jsx';

import * as LoginActions from '../actions/LoginActions.jsx';
import LoginStore from '../stores/LoginStore.jsx';

require('../src/css/Dashboard.css');
require('../src/css/Graph.css');


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
      <div className="container-fluid">
        <div className="row">

          <div className="col-sm-3 col-md-2 sidebar">
            <PlotList onPlotSelect={this.onPlotSelect.bind(this)}/>
          </div>
          
          <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
            <Graph changeChart={this.changeChart.bind(this)} chart={this.state}/>
          </div>
          
        </div>
      </div>
    )
  }
}

export default Dashboard;
