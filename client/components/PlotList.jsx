import React from 'react';

import Plot from './Plot.jsx';
import * as PlotExpActions from '../actions/PlotExpActions.jsx';
import PlotExpStore from '../stores/PlotExpStore.jsx';

class PlotList extends React.Component {
  constructor() {
    super();

    this.getPlotExps = this.getPlotExps.bind(this);

    this.state = {
      plot_exps: PlotExpStore.getAll()
    };

  }

  componentWillMount() {
    PlotExpStore.on('change', this.getPlotExps);
    console.log("count", PlotExpStore.listenerCount("change"));
  }

  componentWillUnmount() {
    PlotExpStore.removeListener('change', this.getPlotExps);
  }

  getPlotExps() {
    this.setState({
      plot_exps: PlotExpStore.getAll()
    });
  }

  reloadPlotExps(plot_exp) {
    PlotExpActions.reloadPlotExps();
  }
  
  render() {
    const { plot_exps } = this.state;
    const PlotComponents = plot_exps.map((plot_exp) => {
      return <Plot key={plot_exp.id} {...plot_exp}/>
    });

    return (
      <div>
        <h1 className="page-header">{this.props.title}</h1>
        <button onClick={this.reloadPlotExps.bind(this)}>Reload</button>
        <ul className="nav nav-sidebar">
          { PlotComponents }
        </ul>
      </div>
    )
  }
}

export default PlotList;
