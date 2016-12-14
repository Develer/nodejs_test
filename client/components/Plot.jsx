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
    // console.log('mount');
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
    // console.log("begin");
    const { plotExp } = this.props;
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
