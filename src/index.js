import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
// import { StateMachineProvider, createStore } from 'little-state-machine';
import App from './containers/App';
import './dist/output.css';
import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

/*
TODO: 
Tabs for robot cards: On log in, show tab with user created robots, tab2 shows general robots
Migrate state to Zustand
Be able to click entire card for robot info, not just name
Hook up create robot form to backend
Add styling for profile page
If RT/AT expires, actually log user out on front end and not just 401 error (i.e. setup res interceptor)
*/

const queryClient = new QueryClient();

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  // <React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
  </QueryClientProvider>
  // </React.StrictMode>
);
