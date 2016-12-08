import React from 'react';
import PlotList from '../components/PlotList.jsx';
import Graph from '../components/Graph.jsx';

class Dashboard extends React.Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="row">

          <div className="col-sm-3">
            <PlotList/>
          </div>
          
          <div className="col-sm-9">
            <Graph/>
          </div>
          
        </div>
      </div>
    )
  }
}

export default Dashboard;
