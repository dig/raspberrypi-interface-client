import React from 'react';
import ClassLister from 'css-module-class-lister';
import { spotifyApi, getAccessToken } from './Spotify';

import styles from '../assets/style/audio.module.css';
import Pause from '../assets/image/pause.png';
import FastForward from '../assets/image/fast-forward.png';
import Volume from '../assets/image/volume.png';

import Progress from './Progress';

const classes = ClassLister(styles);

class Audio extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      percent: 0,
      volume: 0,
      track: {
        name: '...'
      },
      artist: {
        name: '...'
      }
    };
  }

  componentDidMount = () => {
    this.refreshToken();
    this.refreshInterval = setInterval(this.refreshToken, 3000 * 1000)
  };
  
  componentWillUnmount = () => clearInterval(this.refreshInterval);

  refreshToken = async () => {
    const request = await getAccessToken();
    if (request.status === 200) {
      const data = await request.json();
      spotifyApi.setAccessToken(data.access_token);
      console.log('Access token set successfully');
    } else {
      console.error(`Unable to fetch spotify access token: ${request.statusText}, retrying in 5 seconds...`);
      setTimeout(this.refreshToken, 5 * 1000);
    }
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
            <img className={classes('statecontrol', 'statecontrol-left', 'flip-horizontal')} src={FastForward} alt="Go back icon" />
          </div>

          <div className={classes('control', 'control-mid')}>
            <img className={classes('statecontrol', 'statecontrol-mid')} src={Pause} alt="Pause / play icon" />
          </div>

          <div className={styles.control}>
            <img className={classes('statecontrol', 'statecontrol-right')} src={FastForward} alt="Fast forward icon" />
          </div>
        </div>

        <div className={styles.volume}>
          <div className={styles.volumeicon}>
            <img src={Volume} alt="Volume icon" />
          </div>

          <div className={styles.volumeslider}>
            <Progress height={'20%'} progress={this.state.volume}></Progress>
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