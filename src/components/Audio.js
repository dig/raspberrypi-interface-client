import React from 'react';
import styles from '../assets/style/audio.module.css';

import Progress from './Progress';

class Audio extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.background}>
        <div className={styles.trackprogress}>
          <Progress></Progress>
        </div>
      </div>
    );
  }
}

export default Audio;