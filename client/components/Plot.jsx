import React from 'react';

class Plot extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      plot_id: null,
      user_id: null,
      plot: ""
    }
  }

  componentWillMount() {
    // console.log('mount Plot');
    this.setState({
      plot_id: this.props.plotId,
      user_id: this.props.userId,
      plot: this.props.plotExp
    })
  }

  componentWillReceiveProps(props) {
    // console.log('mount Plot');
    this.setState({
      plot_id: this.props.plotId,
      user_id: this.props.userId,
      plot: this.props.plotExp
    })
  }

  onPlotClick() {
    this.props.onPlotClick(this.state);
  }

  render() {
    const { plotExp } = this.props;
    // console.log("begin");
    return (
      <li>
        <button
          className="btn btn-lg btn-primary"
          onClick={this.onPlotClick.bind(this)}>
            {plotExp}
        </button>
      </li>
    )
  }
}

export default Plot;
