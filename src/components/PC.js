import React from 'react';
import ClassLister from 'css-module-class-lister';
import Chartist from 'chartist';
import ChartistGraph from 'react-chartist';

import styles from '../assets/style/pc.module.css';

const classes = ClassLister(styles);

const CHART_OPTIONS = {
  showArea: true,
  axisX: {
    type: Chartist.FixedScaleAxis,
    divisor: 7,
    showLabel: false,
    offset: 0,
  },
  axisY: {
    showLabel: false,
    offset: 0,
  },
  showPoint: false,
  lineSmooth: false,
  chartPadding: 0,
  fullWidth: true,
  low: 0,
};

class PC extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cpu: {
        data: []
      },
      gpu: {
        data: []
      },
    };
  }

  render() {
    return (
      <div className={styles.stats}>
        <div className={styles.row}>
          <div className={classes('stat', 'stat_two')}>
            <div className={styles.information}>
              <div className={styles.information_name}>
                <div className={styles.information_name_title}>
                  <div>CPU</div>
                </div>

                <div className={styles.information_name_brand}>
                  <div>...</div>
                </div>
              </div>

              <div className={styles.information_value}>
                <div className={styles.information_value_big}>
                  <div>0%</div>
                </div>

                <div className={styles.information_value_small}>
                  <div>0c</div>
                </div>
              </div>
            </div>

            <div className={styles.chart}>
              <ChartistGraph className="ct-double-octave" data={{
                series: [
                  { data: this.state.cpu.data }
                ]
              }} 
              type={'Line'} 
              options={{
                high: 100,
                low: 0,
                ...CHART_OPTIONS
              }} />
            </div>
          </div>

          <div className={classes('stat', 'stat_two')}>
            <div className={styles.information}>
              <div className={styles.information_name}>
                <div className={styles.information_name_title}>
                  <div>GPU</div>
                </div>

                <div className={styles.information_name_brand}>
                  <div>...</div>
                </div>
              </div>

              <div className={styles.information_value}>
                <div className={styles.information_value_big}>
                  <div>0%</div>
                </div>

                <div className={styles.information_value_small}>
                  <div>0c</div>
                </div>
              </div>
            </div>

            <div className={styles.chart}>
              <ChartistGraph className="ct-double-octave" data={{
                series: [
                  { data: this.state.gpu.data }
                ]
              }} 
              type={'Line'} 
              options={{
                high: 100,
                low: 0,
                ...CHART_OPTIONS
              }} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PC;