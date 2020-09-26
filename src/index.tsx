import React from 'react';
// import { render } from 'react-snapshot';
import { hydrate, render } from "react-dom";
import App from './App';
import './index.css';

const rootElement = document.getElementById("root") as any;
if (rootElement.hasChildNodes()) {
  hydrate(<App />, rootElement);
} else {
  render(<App />, rootElement);
}