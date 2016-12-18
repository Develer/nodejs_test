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

    var ahref = $(event.target);
    $(".list-group-item").removeClass('active');
    ahref.addClass("active");

    this.props.onPlotClick(this.state);
  }

  render() {
    const { plotExp } = this.props;
    return (
      <a href="#"
         class="list-group-item"
         onClick={this.onPlotClick.bind(this)}>{ plotExp }</a>
    )
  }
}

export default Plot;
