import React from 'react';
import * as d3 from "d3";
import Parser from 'expr-eval';

import * as PlotExpActions from '../actions/PlotExpActions.jsx';

// var Parser = require('expr-eval').Parser;


class Graph extends React.Component {
  constructor(props) {
    super(props);

    this.parser = Parser;

    this.state = {
      plot_id: '',
      user_id: '',
      plot: '',
      data: [],
      x: null,
      y: null,
      xAxis: null,
      yAxis: null,
      line: null,
      chart: null
    };

    this.initGraph = this.initGraph.bind(this);
    this.updateGraph = this.updateGraph.bind(this);
    this.cleanChart = this.cleanChart.bind(this);
  }

  componentWillMount() {
    console.log('mount graph');
  }

  componentDidMount() {
    this.initGraph();
    // this.updateGraph();
  }

  componentWillReceiveProps(props) {
    // console.log('componentWillReceiveProps', props.chart);
    this.setState({
      plot_id: props.chart.plot_id,
      user_id: props.chart.user_id,
      plot: props.chart.plot,
      // data: []
    });

    this.state.data = [];

    // console.log('this.state.data before: ', this.state.data);
    
    var parser = new this.parser.Parser();
    for (var i = -5; i <= 5; i++) {
      this.state.data.push([i, parser.evaluate(props.chart.plot, { x: i })]);
    }

    // console.log('this.state.data after: ', this.state.data);

    this.updateGraph();
  }

  componentWillUnmount() {
    console.log('unmount graph');
  }

  initGraph() {
    var data = [];
    for (var i = -5; i <= 5; i++) {
      data.push([i, 0]);
    }

    var svg = d3.select("svg"),
      margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom,
      g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var x = d3.scaleLinear()
        .rangeRound([0, width]);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var line = d3.line().curve(d3.curveCardinal.tension(0))
        .x(function(d) { return x(d[0]); })
        .y(function(d) { return y(d[1]); });

    x.domain(d3.extent(data, function(d) { return d[0]; }));
    y.domain(d3.extent(data, function(d) { return d[1]; }));

    var xAxis = g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
      .append("text")
        .attr("transform", "translate(" + width +", 0)")
        .attr("fill", "#000")
        // .attr("transform", "rotate(-90)")
        .attr("x", 10)
        .attr("dy", "0.71em")
        .style("text-anchor", "end")
        .text("X");

    var yAxis = g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y))
      .append("text")
        .attr("fill", "#000")
        // .attr("transform", "rotate(-90)")
        .attr("y", -2)
        // .attr("dx", "0.71em")
        .style("text-anchor", "end")
        .text("Y");

    var chart = g.append("path")
          .datum(data)
          .attr("class", "line")
          .attr("d", line);

    this.setState({
      x: x,
      y: y,
      xAxis: xAxis,
      yAxis: yAxis,
      line: line,
      chart: chart
    });
  }

  updateGraph() {
    this.state.x.domain(d3.extent(this.state.data, function(d) { return d[0]; }));
    this.state.y.domain(d3.extent(this.state.data, function(d) { return d[1]; }));

    // this.state.xAxis.call(d3.axisBottom(this.state.x));
    // this.state.yAxis.call(d3.axisLeft(this.state.y));

    this.state.chart
      .transition()
      .duration(1000)
      .attr('d', this.state.line(this.state.data));

    // this.setState({
    //   x: x,
    //   y: y,
    //   chart: chart
    // });
  }

  onChartChange(event) {
    this.setState({
      plot: event.target.value
    });
  }

  createChart() {
    PlotExpActions.createPlotExp(1, this.state.plot);
  }

  updateChart() {
    PlotExpActions.updatePlotExp(this.state.plot_id, 1, this.state.plot);
    // this.setState({
    //   plot_id: this.state.plot_id,
    //   user_id: 1,
    //   plot: this.state.plot
    //   // data: []
    // });
    // PlotExpActions.reloadPlotExps();
  }

  deleteChart() {
    PlotExpActions.deletePlotExp(this.state.plot_id, 1);
  }

  cleanChart() {
    var data = [];
    for (var i = -5; i <= 5; i++) {
      data.push([i, 0]);
    }
    this.setState({
      plot_id: '',
      user_id: '',
      plot: '',
      // data: data,
    });

    this.state.data = data;

    // console.log('this.state.data cleanChart: ', this.state.data);


    this.updateGraph();
  }

  render() {
    return (
      <div>
        <div className="form-inline">
          <input type="text" className="form-control" value={this.state.plot} onChange={this.onChartChange.bind(this)}/>
          {(this.state.plot_id)
            ? <button className="btn btn-default" onClick={this.updateChart.bind(this)}>Update</button>
            : <button className="btn btn-success" onClick={this.createChart.bind(this)}>Create</button>}
          { (this.state.plot_id)
            ? <button className="btn btn-danger" onClick={this.deleteChart.bind(this)}>Delete</button>
            : null }
          <button className="btn btn-default" onClick={this.cleanChart.bind(this)}>Clean</button>
        </div>
        
        <div>
          <svg width="500" height="500"></svg>
        </div>
      </div>
    )
  }
}

export default Graph;
