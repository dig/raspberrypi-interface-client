import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import '../assets/style/index.css';
import Main from './Main';
import PC from './PC';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/pc' exact component={PC} />
        <Route path='*' component={Main} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;