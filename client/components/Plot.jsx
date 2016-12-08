import React from 'react';

class Plot extends React.Component {
  // // constructor doen't necessary
  // constructor(props) {
  //   super();
  // }

  render() {
    const { plot_exp } = this.props;
    return (
      <li><a href="#">{plot_exp}</a></li>
    )
  }
}

export default Plot;
