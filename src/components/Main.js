import React from 'react';
import ClassLister from 'css-module-class-lister';
import { Link } from 'react-router-dom';

import styles from '../assets/style/main.module.css';
import Discord from '../assets/image/discord.png';
import BarChart from '../assets/image/bar-chart.png';

import Audio from './Audio';

const classes = ClassLister(styles);

const Main = (props) => {
  return (
    <div className={styles.outer}>
      <div className={styles.shortcuts}>
        <div className={classes('shortcut', 'discord')}>
          <img src={Discord} />
        </div>

        <Link to={'/pc'}>
          <div className={classes('shortcut', 'pcstats')}>
            <div className={styles.title}>
              PC Stats
            </div>
            <img src={BarChart} />
          </div>
        </Link>
      </div>

      <div className={styles.audio}>
        <Audio />
      </div>
    </div>
  );
};

export default Main;