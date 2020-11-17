import React from 'react';
import ReactSlider from 'react-slider';

import styles from '../assets/style/controls.module.css';
import Refresh from '../assets/image/refresh-page-option.png';
import ArrowRight from '../assets/image/right-arrow.png';

const SOCKET_KEY = 'controls';

class Controls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      test: 'yellow',
    };
  }

  componentDidMount = () => this.props.addSocketListener(SOCKET_KEY, 'update_state', this.handleUpdateState);

  componentWillUnmount = () => this.props.removeSocketListener(SOCKET_KEY);

  handleClose = (event) => {
    event.preventDefault();
    if (event.target === event.currentTarget) {
      this.props.close();
    }
  }

  handleAfterChange = (value) => {
    if (value >= 100) {
      this.props.emitSocketMessage('shutdown', true);
    }
  }

  handleUpdateClick = () => this.props.emitSocketMessage('update', true);

  handleUpdateState = (state) => {
    state = Number(state);
    this.setState({ test: state === 0 ? 'red' : 'green' });
  }

  render() {
    return (
      <div className={styles.background} onClick={this.handleClose}>
        <div className={styles.sliderouter}>
          <ReactSlider 
            value={this.state.value}
            className={styles.slider}
            thumbClassName={styles.thumb}
            trackClassName={styles.track}
            onAfterChange={this.handleAfterChange}
            renderThumb={(props) => <div {...props}><img src={ArrowRight} alt="Right icon" /></div>}
          />
        </div>

        <div className={styles.update}>
          <img src={Refresh} alt="Update icon" styles={{ background: this.state.test }} onClick={this.handleUpdateClick} />
        </div>
      </div>
    );
  }
}

export default Controls;