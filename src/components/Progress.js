import React from 'react';
import styles from '../assets/style/progress.module.css';

const Progress = (props) => {
  return (
    <div className={styles.outer} style={{
      backgroundColor: props.background ? props.background : '#404040',
      height: props.height
    }} onClick={props.onClick ? props.onClick : () => null}>
      <div className={styles.inner} style={{
        backgroundColor: props.innerBackground ? props.innerBackground : '#b3b3b3',
        width: `${props.progress ? props.progress : 0}%`
      }}></div>
    </div>
  );
};

export default Progress;