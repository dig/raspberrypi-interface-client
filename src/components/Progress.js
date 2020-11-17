import React from 'react';
import styles from '../assets/style/progress.module.css';

class Progress extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pointerDown: false,
      progress: 0,
    };
  }

  handlePointerDown = () => this.setState({ pointerDown: true, progress: this.props.progress ? this.props.progress : 0 });

  handlePointerUp = async (event) => {
    if (this.props.onClick) {
      await this.props.onClick(event);
    }

    this.setState({ pointerDown: false });
  }

  handlePointerMove = (event) => {
    if (this.state.pointerDown) {
      let newValue = event.nativeEvent.offsetX * 1 / event.currentTarget.offsetWidth;
      if (newValue < 0.05) {
        newValue = 0;
      }

      this.setState({ progress: Math.round(newValue * 100) });
    }
  }

  render() {
    return (
      <div className={styles.outer} style={{
        backgroundColor: this.props.background ? this.props.background : '#404040',
        height: this.props.height,
        touchAction: 'none'
      }} onPointerMove={this.handlePointerMove}
        onPointerDown={this.handlePointerDown}
        onPointerUp={this.handlePointerUp}>
        <div className={styles.inner} style={{
          backgroundColor: this.props.innerBackground ? this.props.innerBackground : '#b3b3b3',
          width: `${this.state.pointerDown ? this.state.progress : (this.props.progress ? this.props.progress : 0)}%`
        }}></div>
      </div>
    );
  }
}

export default Progress;