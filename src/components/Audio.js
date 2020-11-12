import React from 'react';
import styles from '../assets/style/audio.module.css';

import Progress from './Progress';

class Audio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      percent: 0,
      track: {
        name: 'Test track name'
      },
      artist: {
        name: 'Test artist name'
      }
    };
  }

  render() {
    return (
      <div className={styles.background}>
        <div className={styles.trackinformation}>
          <div className={styles.track}>
            <div>{this.state.track.name}</div>
          </div>

          <div className={styles.artist}>
            <div>{this.state.artist.name}</div>
          </div>
        </div>

        <div className={styles.trackprogress}>
          <Progress progress={this.state.percent}></Progress>
        </div>
      </div>
    );
  }
}

export default Audio;