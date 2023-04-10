import React from 'react';
// import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { StateMachineProvider, createStore } from 'little-state-machine';
import App from './containers/App';

createStore({
  data: {
    firstName: '',
    lastName: '',
  },
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
