import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { StateMachineProvider, createStore } from 'little-state-machine';
import App from './containers/App';
import './dist/output.css';

export const robotFormDefault = {
  robotFormBasic: {
    firstName: 'SampleFirstName',
    lastName: 'SampleLastName',
    password: '',
    maidenName: 'SampleMaidenName',
    email: 'email@email.com',
    birthdate: '2000-01-01',
    age: '10',
    phone: '+1 111-111-1111',
    university: 'Sample University',
  },
  robotFormAppearance: {
    image: `https://robohash.org/${Date.now().toString().slice(-9)}.png`,
    bloodGroup: 'O',
    eyeColor: 'Brown',
    hair: { color: 'Brown', type: 'Curly' },
    height: '186',
    weight: '54.4',
  },
  robotFormLocation: {
    address: '8376 Albacore Drive',
    city: 'Pasadena',
    postalCode: '21122',
    state: 'MD',
    coordinates: { lat: '39.110409', lng: '-76.46565799999999' },
  },
  robotFormFinancial: {
    cardExpire: '06/22',
    cardNumber: '3565600124206309',
    cardType: 'jcb',
    currentcy: 'Krona',
    iban: 'FR19 2200 9407 28AH Q2CV AT31 S49',
  },
  robotFormMisc: {
    macAddress: 'E1:00:69:FF:2D:94',
    ein: '02-4892541',
    userAgent:
      'Mozilla/5.0 (Windows; U; Windows NT 6.0; ja-JP) AppleWebKit/533.16 (KHTML, like Gecko) Version/5.0 Safari/533.16',
    domain: 'odnoklassniki.ru',
  },
  robotFormToc: ['Basic', 'Appearance', 'Location', 'Financial', 'Misc'],
};

createStore({
  page: 0,
  launchedForm: false,
  ...robotFormDefault,
});

/*
TODO: 
Tabs for robot cards: On log in, show tab with user created robots, tab2 shows general robots
Migrate state to Zustand
Be able to click entire card for robot info, not just name
Hook up create robot form to backend
Add styling for profile page
If RT/AT expires, actually log user out on front end and not just 401 error (i.e. setup res interceptor)
*/

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
