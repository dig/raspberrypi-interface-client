import React from 'react';
import ClassLister from 'css-module-class-lister';
import { spotifyApi, getTokenByAuthCode, refreshAccessByRefresh, redirectToLogin } from './Spotify';

import styles from '../assets/style/audio.module.css';
import Pause from '../assets/image/pause.png';
import FastForward from '../assets/image/fast-forward.png';
import Volume from '../assets/image/volume.png';
import VolumeHalf from '../assets/image/volume-half.png';
import VolumeLow from '../assets/image/volume-low.png';
import VolumeEmpty from '../assets/image/volume-empty.png';
import Play from '../assets/image/play.png';

import Progress from './Progress';

const classes = ClassLister(styles);
const SPOTIFY_REFRESH_TOKEN_KEY = '__spotify_refresh_token';

class Audio extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      code: '',
      access_token: '',
      refresh_token: '',

      playing: false,
      percent: 0,
      volume: 50,
      track: {
        name: '...'
      },
      artist: {
        name: '...'
      }
    };
  }

  componentDidMount = async () => {
    if (localStorage.getItem(SPOTIFY_REFRESH_TOKEN_KEY) != null) {
      console.log('spotify : using refresh token from storage');
      await this.setRefreshToken(localStorage.getItem(SPOTIFY_REFRESH_TOKEN_KEY));
      await this.refreshAccessToken();
      this.startAccessRefresh();
      this.onSpotifyAuthorization();
    } else {
      const query = new URLSearchParams(window.location.search);
      if (query.has('code')) {
        console.log('spotify : found code in querystring');
        const request = await getTokenByAuthCode(query.get('code'));
        if (request.status === 200) {
          const data = await request.json();
          await this.setAccessToken(data.access_token);
          await this.setRefreshToken(data.refresh_token);

          this.startAccessRefresh();
          this.onSpotifyAuthorization();
          return;
        }
      }

      redirectToLogin();
    }
  }

  startAccessRefresh = () => {
    console.log('spotify : startAccessRefresh');
    this.refreshInterval = setInterval(this.refreshAccessToken, 3000 * 1000);
  }

  refreshAccessToken = async () => {
    console.log('spotify : refreshAccessToken');
    const request = await refreshAccessByRefresh(this.state.refresh_token);
    if (request.status === 200) {
      const data = await request.json();
      await this.setAccessToken(data.access_token);
    } else {
      console.log('spotify : could not refresh using refresh token, starting again...');
      localStorage.removeItem(SPOTIFY_REFRESH_TOKEN_KEY);
      redirectToLogin();
    }
  }

  componentWillUnmount = () => {
    clearInterval(this.refreshInterval);
    clearInterval(this.refreshTrackInterval);
  };

  setAccessToken = async (token) => {
    console.log('spotify : setAccessToken');
    spotifyApi.setAccessToken(token);
    await this.setState({ access_token: token });
  }

  setRefreshToken = async (token) => {
    console.log('spotify : setRefreshToken');
    localStorage.setItem(SPOTIFY_REFRESH_TOKEN_KEY, token);
    await this.setState({ refresh_token: token });
  }

  onSpotifyAuthorization = async () => {
    await this.refreshTrackInformation();
    this.refreshTrackInterval = setInterval(this.refreshTrackInformation, 60 * 1000);
    await spotifyApi.setVolume(this.state.volume);
  }

  refreshTrackInformation = async () => {
    const current = await spotifyApi.getMyCurrentPlayingTrack();
    if (current.is_playing && current.item) {
      let artist = '...';
      if (current.item.artists.length > 0) {
        artist = current.item.artists[0].name;
      }

      this.setState({
        playing: true,
        track: {
          name: current.item.name
        },
        artist: {
          name: artist
        }
      });
    }
  }

  handleStateControl = async () => {
    if (this.state.playing) {
      await spotifyApi.pause();
      this.setState({ playing: false });
    } else {
      await spotifyApi.play();
      this.setState({ playing: true });
    }
  }

  handleVolumeClick = async (event) => {
    let newValue = event.nativeEvent.offsetX * 1 / event.currentTarget.offsetWidth;
    if (newValue < 0.05) {
      newValue = 0;
    }
    await this.setState({ volume: Math.round(newValue * 100) });
    await spotifyApi.setVolume(this.state.volume);
  }

  handleVolumeIconClick = async (event) => {
    await this.setState({ volume: 0 });
    await spotifyApi.setVolume(this.state.volume);
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
            <img className={classes('statecontrol', 'statecontrol-mid')} src={this.state.playing ? Pause : Play} onClick={this.handleStateControl} alt="Pause / play icon" />
          </div>

          <div className={styles.control}>
            <img className={classes('statecontrol', 'statecontrol-right')} src={FastForward} alt="Fast forward icon" />
          </div>
        </div>

        <div className={styles.volume}>
          <div className={styles.volumeicon}>
            <img src={this.state.volume > 50 ? Volume : (this.state.volume > 10 ? VolumeHalf : (this.state.volume > 1 ? VolumeLow : VolumeEmpty))} alt="Volume icon" onClick={this.handleVolumeIconClick} />
          </div>

          <div className={styles.volumeslider}>
            <Progress height={'20%'} progress={this.state.volume} onClick={this.handleVolumeClick}></Progress>
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