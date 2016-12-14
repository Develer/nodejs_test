import React from 'react';
import Nav from './components/Nav.jsx';

class App extends React.Component {
    constructor(props) {
      super(props)

      // this.state = {
      //   session: "hello"
      // }
    }

    navigate() {
      this.forceUpdate(null, '/');
    }
   
    render() {
      return (
        <div>
          <Nav navigate={ this.navigate.bind(this) }/>
          { this.props.children }
        </div>
      );
  }
}

export default App;
