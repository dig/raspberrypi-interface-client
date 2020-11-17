import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import WebSocket from 'ws';

import '../assets/style/index.css';
import Main from './Main';
import PC from './PC';
import Audio from './Audio';
import Update from './Update';

const CHANNEL_MESSAGE_REGEX = /^([a-zA-Z0-9]+)((;([a-zA-Z0-9{}():"',.@#-\s\\]+))+)$/;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      update: false,
    };
    this.listeners = {};
  }

  componentDidMount = () => {
    this.ws = new WebSocket(`ws://localhost:${process.env.REACT_APP_SOCKET_PORT}`);
    this.ws.onopen = () => this.ws.send(`authenticate;${process.env.REACT_APP_SOCKET_AUTH_KEY};1`);
    this.ws.onmessage = this.handleSocketMessage;
  };

  componentWillUnmount = () => this.ws.close();

  handleSocketMessage = (event) => {
    const message = event.data;
    if (message.match(CHANNEL_MESSAGE_REGEX)) {
      const args = message.split(';');
      const channel = args[0];
      args.shift();
      const value = args.join(';');
      
      for (const key of Object.keys(this.listeners)) {
        const callback = this.listeners[key][channel];
        callback(value);
      }
    }
  }

  addSocketListener = (key, channel, callback) => {
    console.log(`addSocketListener : ${key} ${channel}`);
    if (!this.listeners[key]) {
      this.listeners[key] = {};
    }
    this.listeners[key][channel] = callback;
  }

  removeSocketListener = (key) => {
    console.log(`removeSocketListener : ${key}`);
    delete this.listeners[key];
  }

  handleMouseDown = () => this.mouseDownTimeout = setTimeout(this.handleUpdateClick, 5000);

  handleMouseUp = () => clearTimeout(this.mouseDownTimeout);

  handleUpdateClick = () => {
    console.log('handleUpdateClick');
  }

  render() {
    return (
      <div className="app" onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp}>
        {this.state.update &&
          <Update />
        }

        {!this.state.update &&
          <>
            <div className="content">
              <BrowserRouter>
                <Switch>
                  <Route path='/pc' exact component={() => <PC addSocketListener={this.addSocketListener} removeSocketListener={this.removeSocketListener} />} />
                  <Route path='*' component={Main} />
                </Switch>
              </BrowserRouter>
            </div>

            <div className="audio">
              <Audio />
            </div>
          </>
        }
      </div>
    );
  }
}

export default App;