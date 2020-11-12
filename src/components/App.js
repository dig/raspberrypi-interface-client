import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import '../assets/style/index.css';
import Main from './Main';
import PC from './PC';
import Audio from './Audio';

function App() {
  return (
    <div className="app">
      <div className="content">
        <BrowserRouter>
          <Switch>
            <Route path='/pc' exact component={PC} />
            <Route path='*' component={Main} />
          </Switch>
        </BrowserRouter>
      </div>

      <div className="audio">
        <Audio />
      </div>
    </div>
  );
}

export default App;