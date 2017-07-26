import React from 'react';

import axios from 'axios'

import PlotList from '../components/PlotList.jsx';
import Graph from '../components/Graph.jsx';

import * as LoginActions from '../actions/LoginActions.jsx';
import LoginStore from '../stores/LoginStore.jsx';

require('../src/css/Dashboard.css');
require('../src/css/Graph.css');
require('../src/js/offcanvas.js');


class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      result: 'result_string',
      nouns: [],
      nouns_text: '',
      adjs: [],
      adjs_text: '',
      verbs: [],
      verbs_text: '',
    };

    this.nounsChanged = this.nounsChanged.bind(this);
    this.adjsChanged = this.adjsChanged.bind(this);
    this.verbsChanged = this.verbsChanged.bind(this);
    this.genereteSentense = this.genereteSentense.bind(this);
  }

  nounsChanged(event) {
    this.setState({
      nouns: event.target.value.split(/\r?\n/),
      nouns_text: event.target.value
    })
  }

  adjsChanged(event) {
    this.setState({
      adjs: event.target.value.split(/\r?\n/),
      adjs_text: event.target.value
    })
  }

  verbsChanged(event) {
    this.setState({
      verbs: event.target.value.split(/\r?\n/),
      verbs_text: event.target.value
    })
  }

  genereteSentense(event) {
    event.preventDefault();

    console.log('genereteSentense')
    console.log(this.state.nouns)
    console.log(this.state.adjs)
    console.log(this.state.verbs)

    var postData = JSON.stringify({
      "noun": this.state.nouns,
      "adj":this.state.adjs,
      "verb":this.state.verbs
    });

    axios.post('http://127.0.0.1:8081', postData)
      .then(res => {
        if (res.data) {
          console.log('res=', res);
          this.setState({
            result: res.data
          })
        }
      })
      .catch(err => {
        console.error('An error occurred: ', err)
      })
  }

  render() {
    return (
      <div class="container">

        <div class="row">
          <form onSubmit={this.genereteSentense}>
            <p>{this.state.result}</p>
            <div className='form-group'>
              <label>Nouns</label>
              <textarea className='form-control'
                value={this.state.nouns_text}
                onChange={this.nounsChanged}
                rows='5'></textarea>
            </div>
            <div className='form-group'>
              <label>Adjs</label>
              <textarea className='form-control'
                value={this.state.adjs_text}
                onChange={this.adjsChanged}
                rows='5'></textarea>
            </div>
            {/*<div className='form-group'>
              <label>Verbs</label>
              <textarea className='form-control'
                value={this.state.verbs_text}
                onChange={this.verbsChanged}
                rows='5'></textarea>
            </div>*/}
            <button type='submit' className='btn btn-info'>Generate</button>
          </form>
        </div>

      </div>
    )
  }
}

export default Dashboard;
