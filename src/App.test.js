import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import ReactDOM from "react-dom";
import '@testing-library/jest-dom'


it('renders learn react link', () => {
  const div = document.createElement("div");
  ReactDOM.render(<App/>,div);
  ReactDOM.unmountComponentAtNode(div);
});
