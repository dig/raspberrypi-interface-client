import React from 'react';
import ClassLister from 'css-module-class-lister';
import Chartist from 'chartist';
import ChartistGraph from 'react-chartist';
import WebSocket from 'ws';

import styles from '../assets/style/pc.module.css';
import Home from '../assets/image/home.png';

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
        name: '...',
        data: []
      },
      gpu: {
        name: '...',
        data: []
      },
      memory: {
        name: '...',
        data: []
      },
      disk: {
        name: '...',
        data: []
      },
    };
  }

  componentDidMount = () => {
    this.ws = new WebSocket(`ws://localhost:${process.env.REACT_APP_SOCKET_PORT}`);
    this.ws.onopen = (event) => this.ws.send(`authenticate:${process.env.REACT_APP_SOCKET_AUTH_KEY}:1`);
    this.ws.onmessage = (event) => console.log(event);
  };
  componentWillUnmount = () => this.ws.close();

  handleHomeClick = () => this.props.history.push('/');

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
                  <div>{this.state.cpu.name}</div>
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
                  <div>{this.state.gpu.name}</div>
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

        <div className={styles.row}>
          <div className={classes('stat', 'stat_two')}>
            <div className={styles.information}>
              <div className={styles.information_name}>
                <div className={styles.information_name_title}>
                  <div>Memory</div>
                </div>

                <div className={styles.information_name_brand}>
                  <div>{this.state.memory.name}</div>
                </div>
              </div>

              <div className={styles.information_value}>
                <div className={styles.information_value_full}>
                  <div>0/0 GB</div>
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
                  <div>Disk</div>
                </div>

                <div className={styles.information_name_brand}>
                  <div>{this.state.disk.name}</div>
                </div>
              </div>

              <div className={styles.information_value}>
                <div className={styles.information_value_full}>
                  <div>0%</div>
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

        <div className={styles.row_small}>
          <div className={classes('stat', 'stat_small', 'stat_middle')}>
            <div className={styles.title}>
              Uptime
            </div>

            <div className={styles.text}>
              {this.state.uptime ? this.state.uptime : '...'}
            </div>
          </div>

          <div className={classes('stat', 'stat_small', 'stat_middle')}>
            <div className={styles.title}>
              Download
            </div>

            <div className={styles.text}>
              {this.state.download ? this.state.download : '...'}
            </div>
          </div>

          <div className={classes('stat', 'stat_small', 'stat_middle')}>
            <div className={styles.title}>
              Upload
            </div>

            <div className={styles.text}>
              {this.state.upload ? this.state.upload : '...'}
            </div>
          </div>

          <div className={classes('stat', 'stat_small', 'stat_middle')}>
            <div className={styles.title}>
              VRAM
            </div>

            <div className={styles.text}>
              {this.state.vram ? this.state.vram : '...'}
            </div>
          </div>

          <div className={classes('stat', 'stat_small', 'stat_middle', 'stat_right')} onClick={this.handleHomeClick}>
            <img src={Home} alt="Home icon" />
          </div>
        </div>
      </div>
    );
  }
}

export default PC;