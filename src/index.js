import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { StateMachineProvider, createStore } from 'little-state-machine';
import App from './containers/App';
import './dist/output.css';

createStore({
  firstName: '',
  lastName: '',
  page: 0,
  launchedForm: false,
});

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  // <React.StrictMode>
  <StateMachineProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StateMachineProvider>
  // </React.StrictMode>
);
