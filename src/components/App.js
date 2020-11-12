import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import '../assets/style/index.css';
import Audio from './Audio';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='*' component={Audio} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;