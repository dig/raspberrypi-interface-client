import React from 'react';
import ClassLister from 'css-module-class-lister';

import styles from '../assets/style/main.module.css';
import Discord from '../assets/image/discord.png';
import BarChart from '../assets/image/bar-chart.png';

const classes = ClassLister(styles);

const Main = (props) => {
  return (
    <div className={styles.shortcuts}>
      <div className={styles.row}>
        <div className={classes('shortcut', 'discord')}>
          <img src={Discord} alt="Discord icon" />
        </div>

        <div className={classes('shortcut', 'pcstats')} onClick={() => props.history.push('/pc')}>
          <div className={styles.shortcut_inner}>
            <div className={styles.title}>
              PC Stats
            </div>
            <img src={BarChart} alt="Bar chart icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;