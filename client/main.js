import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from "react-router";

import App from './App.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

var app = document.getElementById('app');

render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Dashboard}></IndexRoute>
      <Route path="/dashboard" component={Dashboard}></Route>
      <Route path="/register" component={Register}></Route>
      <Route path="/login" component={Login}></Route>
    </Route>
  </Router>,
  app);
