import React from 'react';
import classLister from 'css-module-class-lister';

import styles from '../assets/style/audio.module.css';
import Pause from '../assets/image/pause.png';
import FastForward from '../assets/image/fast-forward.png';

import Progress from './Progress';

const classes = classLister(styles);

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

        <div className={styles.controls}>
          <div className={styles.control}>
            <img className={classes('statecontrol', 'statecontrol-left', 'flip-horizontal')} src={FastForward} />
          </div>

          <div className={classes('control', 'control-mid')}>
            <img className={classes('statecontrol', 'statecontrol-mid')} src={Pause} />
          </div>

          <div className={styles.control}>
            <img className={classes('statecontrol', 'statecontrol-right')} src={FastForward} />
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