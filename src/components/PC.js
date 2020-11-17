import React from 'react';
import { withRouter } from 'react-router-dom';
import ClassLister from 'css-module-class-lister';
import Chartist from 'chartist';
import ChartistGraph from 'react-chartist';

import styles from '../assets/style/pc.module.css';
import Home from '../assets/image/home.png';

const SOCKET_KEY = 'pc';

const STORAGE_CPU_NAME_KEY = 'cpuName';
const STORAGE_GPU_NAME_KEY = 'gpuName';
const STORAGE_MEMORY_NAME_KEY = 'memoryName';
const STORAGE_MEMORY_TOTAL_KEY = 'memoryTotal';
const STORAGE_DISK_NAME_KEY = 'diskName';

const STORAGE_SYSTEM_UPTIME_KEY = 'systemUptime';
const STORAGE_SYSTEM_SINCE_KEY = 'systemSince';

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
        name: localStorage.getItem(STORAGE_CPU_NAME_KEY) || '...',
        temp: 0,
        data: []
      },
      gpu: {
        name: localStorage.getItem(STORAGE_GPU_NAME_KEY) || '...',
        temp: 0,
        data: []
      },
      memory: {
        name: localStorage.getItem(STORAGE_MEMORY_NAME_KEY) || '...',
        total: Number(localStorage.getItem(STORAGE_MEMORY_TOTAL_KEY)) || 0,
        data: []
      },
      disk: {
        name: localStorage.getItem(STORAGE_DISK_NAME_KEY) || '...',
        data: []
      },
      network: {
        last: {
          sent: 0,
          receive: 0,
          time: 0
        },
        sent: 0,
        receive: 0,
        time: 0
      },
      system: {
        uptime: Number(localStorage.getItem(STORAGE_SYSTEM_UPTIME_KEY)) || 0,
        since: Number(localStorage.getItem(STORAGE_SYSTEM_SINCE_KEY)) || 0
      },
    };
  }

  componentDidMount = () => this.props.addSocketListener(SOCKET_KEY, 'data', this.handleChannelData);

  componentWillUnmount = () => this.props.removeSocketListener(SOCKET_KEY);

  handleChannelData = (data) => {
    data = JSON.parse(data);
    const newState = this.state;

    // processor
    if (data.processorName) {
      newState.cpu.name = data.processorName;
      localStorage.setItem(STORAGE_CPU_NAME_KEY, data.processorName);
    }

    if (data.processorUsage) {
      while (newState.cpu.data.length >= 60) {
        newState.cpu.data.shift();
      }

      newState.cpu.data.push({
        x: Date.now(),
        y: Number(data.processorUsage)
      });
    }

    if (data.processorTemp) {
      newState.cpu.temp = Number(data.processorTemp);
    }

    // gpu
    if (data.gpuName) {
      newState.gpu.name = data.gpuName;
      localStorage.setItem(STORAGE_GPU_NAME_KEY, data.gpuName);
    }

    // memory
    if (data.memoryName) {
      newState.memory.name = data.memoryName;
      localStorage.setItem(STORAGE_MEMORY_NAME_KEY, data.memoryName);
    }

    if (data.memoryTotal) {
      newState.memory.total = Number(data.memoryTotal);
      localStorage.setItem(STORAGE_MEMORY_TOTAL_KEY, data.memoryTotal);
    }

    if (data.memoryAvailable && newState.memory.total > 0) {
      while (newState.memory.data.length >= 60) {
        newState.memory.data.shift();
      }

      newState.memory.data.push({
        x: Date.now(),
        y: Number(data.memoryAvailable)
      });
    }

    // disk
    if (data.diskName) {
      const name = data.diskName.replace('(Standard disk drives)', '');
      newState.disk.name = name;
      localStorage.setItem(STORAGE_DISK_NAME_KEY, name);
    }

    // system
    if (data.systemUptime) {
      const since = Date.now();
      newState.system.uptime = Number(data.systemUptime);
      newState.system.since = since;

      localStorage.setItem(STORAGE_SYSTEM_UPTIME_KEY, data.systemUptime);
      localStorage.setItem(STORAGE_SYSTEM_SINCE_KEY, since);
    }

    // network
    if (data.networkBytesRecv && data.networkBytesSent) {
      if (newState.network.time > 0) {
        newState.network.last.receive = newState.network.receive;
        newState.network.last.sent = newState.network.sent;
        newState.network.last.time = newState.network.time;
      }

      newState.network.receive = Number(data.networkBytesRecv);
      newState.network.sent = Number(data.networkBytesSent);
      newState.network.time = Date.now();
    }

    this.setState(newState);
  }

  handleHomeClick = () => this.props.history.push('/');

  convertBytesToGb = (bytes) => bytes / 1024 / 1024 / 1024;

  render() {
    const memoryData = [];
    this.state.memory.data.forEach(obj => memoryData.push({
        x: obj.x,
        y: (obj.y / this.state.memory.total) * 100
    }));

    const seconds = (Date.now() - this.state.system.since) / 1000;
    const uptimeSeconds = Math.floor(this.state.system.uptime + seconds);
    let uptime = `${uptimeSeconds} sec${uptimeSeconds > 1 ? 's' : ''}`;
    if (uptimeSeconds >= 86400) {
      const days = Math.floor(uptimeSeconds / 60 / 60 / 24);
      uptime = `${days} day${days > 1 ? 's' : ''}`;
    } else if (uptimeSeconds >= 3600) {
      const hours = Math.floor(uptimeSeconds / 60 / 60);
      uptime = `${hours} hour${hours > 1 ? 's' : ''}`;
    } else if (uptimeSeconds >= 60) {
      const mins = Math.floor(uptimeSeconds / 60);
      uptime = `${mins} min${mins > 1 ? 's' : ''}`;
    }

    const networkDiff = (this.state.network.time - this.state.network.last.time) / 1000;
    
    let download = 0;
    if (this.state.network.time > 0 && this.state.network.last.time > 0) {
      download = (this.state.network.receive - this.state.network.last.receive) / networkDiff;
      if (download >= 1000000) {
        const mb = Math.floor(download / 1000 / 1000);
        download = `${mb} MB/s`;
      } else if (download >= 1000) {
        const kb = Math.floor(download / 1000);
        download = `${kb} kB/s`;
      } else {
        const b = Math.floor(download);
        download = `${b} B/s`;
      }
    }

    let upload = 0;
    if (this.state.network.time > 0 && this.state.network.last.time > 0) {
      upload = (this.state.network.sent - this.state.network.last.sent) / networkDiff;
      if (upload >= 1000000) {
        const mb = Math.floor(upload / 1000 / 1000);
        upload = `${mb} MB/s`;
      } else if (upload >= 1000) {
        const kb = Math.floor(upload / 1000);
        upload = `${kb} kB/s`;
      } else {
        const b = Math.floor(upload);
        upload = `${b} B/s`;
      }
    }

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
                  <div>
                    {
                      this.state.cpu.data.length > 0 
                        ? Math.round(this.state.cpu.data[this.state.cpu.data.length - 1].y) 
                        : 0
                    }%
                  </div>
                </div>

                <div className={styles.information_value_small}>
                  <div>{Math.round(this.state.cpu.temp)}c</div>
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
                  <div>
                    {
                      this.state.gpu.data.length > 0 
                        ? Math.round(this.state.gpu.data[this.state.gpu.data.length - 1].y) 
                        : 0
                    }%
                  </div>
                </div>

                <div className={styles.information_value_small}>
                  <div>{Math.round(this.state.gpu.temp)}c</div>
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
                  <div>
                    {this.state.memory.data.length > 0 
                      ? this.convertBytesToGb(this.state.memory.data[this.state.memory.data.length - 1].y).toFixed(1)
                      : 0}
                    /
                    {this.convertBytesToGb(this.state.memory.total).toFixed(1)} 
                    &nbsp;GB
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.chart}>
              <ChartistGraph className="ct-double-octave" data={{
                series: [
                  { data: memoryData }
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
              {uptime}
            </div>
          </div>

          <div className={classes('stat', 'stat_small', 'stat_middle')}>
            <div className={styles.title}>
              Download
            </div>

            <div className={styles.text}>
              {download}
            </div>
          </div>

          <div className={classes('stat', 'stat_small', 'stat_middle')}>
            <div className={styles.title}>
              Upload
            </div>

            <div className={styles.text}>
              {upload}
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

export default withRouter(PC);