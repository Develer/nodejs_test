import React from 'react';
import * as d3 from "d3";
import Parser from 'expr-eval';

import * as PlotExpActions from '../actions/PlotExpActions.jsx';


class Graph extends React.Component {
  constructor(props) {
    super(props);

    this.parser = Parser;
    this.range = 15;

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

  componentWillMount() {}

  componentDidMount() {
    this.initGraph();
  }

  componentWillReceiveProps(props) {
    this.setState({
      plot_id: props.chart.plot_id,
      user_id: props.chart.user_id,
      plot: props.chart.plot,
    });

    this.state.data = [];

    var parser = new this.parser.Parser();
    for (var i = -this.range; i <= this.range; i++) {
      this.state.data.push([i, parser.evaluate(props.chart.plot, { x: i })]);
    }

    this.updateGraph();
  }

  componentWillUnmount() {}

  initGraph() {
    var data = [];
    for (var i = -this.range; i <= this.range; i++) {
      data.push([i, 0]);
    }

    var svg = d3.select("svg")
      .attr("width", 500)
      .attr("height", 500),
      margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom,
      g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var x = d3.scaleLinear()
        .rangeRound([0, width]);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var line = d3.line().curve(d3.curveNatural)
        .x(function(d) { return x(d[0]); })
        .y(function(d) { return y(d[1]); });

    x.domain(d3.extent(data, function(d) { return d[0]; }));
    y.domain(d3.extent(data, function(d) { return d[1]; }));

    var xAxis = g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")");

    xAxis
      .append("text")
        .attr("transform", "translate(" + width +", 0)")
        .attr("fill", "#000")
        .attr("x", 10)
        .attr("dy", "0.71em")
        .style("text-anchor", "end")
        .text("X");

    xAxis.call(d3.axisBottom(x));

    var yAxis = g.append("g")
        .attr("class", "axis axis--y")

    yAxis.append("text")
        .attr("fill", "#000")
        .attr("y", -2)
        .style("text-anchor", "end")
        .text("Y");

    yAxis.call(d3.axisLeft(y));

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

    this.state.chart
      .transition()
      .duration(1000)
      .attr('d', this.state.line(this.state.data));

    this.state.yAxis
      .transition()
      .duration(1000)
      .call(d3.axisLeft(this.state.y));
  }

  onChartChange(event) {
    this.setState({
      plot: event.target.value
    });
  }

  createChart() {
    PlotExpActions.createPlotExp(1, this.state.plot);
    this.setState({
      plot: this.state.plot,
    });

    this.state.data = [];

    var parser = new this.parser.Parser();
    for (var i = -this.range; i <= this.range; i++) {
      this.state.data.push([i, parser.evaluate(this.state.plot, { x: i })]);
    }

    this.updateGraph();
  }

  updateChart() {
    PlotExpActions.updatePlotExp(this.state.plot_id, 1, this.state.plot);
    
    this.setState({
      plot: this.state.plot
    });

    this.state.data = [];

    var parser = new this.parser.Parser();
    for (var i = -this.range; i <= this.range; i++) {
      this.state.data.push([i, parser.evaluate(this.state.plot, { x: i })]);
    }

    this.updateGraph();
  }

  deleteChart() {
    PlotExpActions.deletePlotExp(this.state.plot_id, 1);
    this.cleanChart();
  }

  cleanChart() {
    // clean selection
    $(".list-group-item").removeClass('active');

    // line drops to zero
    var data = [];
    for (var i = -this.range; i <= this.range; i++) {
      data.push([i, 0]);
    }
    this.state.data = data;
    
    this.setState({
      plot_id: '',
      user_id: '',
      plot: '',
    });

    this.updateGraph();
  }

  render() {
    return (
      <div class="row">
        <svg class="center-block"></svg>
        <div className="center-block">
          <input type="text" className="form-control" value={this.state.plot} onChange={this.onChartChange.bind(this)}/>
        </div>
        <div class="center-block">
          {(this.state.plot_id)
            ? <button className="btn btn-default" onClick={this.updateChart.bind(this)}>Update</button>
            : <button className="btn btn-success" onClick={this.createChart.bind(this)}>Create</button>}
          { (this.state.plot_id)
            ? <button className="btn btn-danger" onClick={this.deleteChart.bind(this)}>Delete</button>
            : null }
          <button className="btn btn-default" onClick={this.cleanChart.bind(this)}>Clean</button>
        </div>
      </div>
    )
  }
}

export default Graph;
