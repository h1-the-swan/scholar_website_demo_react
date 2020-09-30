import React from 'react';
// import { render } from 'react-snapshot';
import { hydrate, render } from "react-dom";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import App from './App';
import HicssNautilus from './hicss';
import './index.css';

const rootElement = document.getElementById("root") as any;
let fn;
if (rootElement.hasChildNodes()) {
  // hydrate(<App />, rootElement);
  fn = hydrate;
} else {
  // render(<App />, rootElement);
  fn = render;
}

fn(
  <Router>
    <Switch>
      <Route path="/hicss/influence" component={HicssNautilus} />
      <Route path="/hicss">
        <Redirect to="/hicss/influence" />
      </Route>
      <Route path="/" component={App} />
    </Switch>
  </Router>,
  rootElement
)