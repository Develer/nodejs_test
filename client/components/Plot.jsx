import React from 'react';


class Plot extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      plot_id: null,
      user_id: null,
      plot: "",
      active: ""
    }
  }

  componentWillMount() {
    this.setState({
      plot_id: this.props.plotId,
      user_id: this.props.userId,
      plot: this.props.plotExp
    })
  }

  componentWillReceiveProps(props) {
    this.setState({
      plot_id: this.props.plotId,
      user_id: this.props.userId,
      plot: this.props.plotExp
    })
  }

  onPlotClick(event) {
    event.preventDefault();
    $('li').removeClass('active');
    this.setState({
      active: "active"
    });
    this.props.onPlotClick(this.state);
  }

  render() {
    const { plotExp } = this.props;
    return (
      <li className={this.state.active}>
        <a href="#"
           onClick={this.onPlotClick.bind(this)}>{ plotExp }</a>
      </li>
    )
  }
}

export default Plot;
