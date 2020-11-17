import React from 'react';
import styles from '../assets/style/progress.module.css';

class Progress extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mouseDown: false,
      progress: 0,
    };
  }

  handleMouseDown = () => {
    console.log('handleMouseDown');
    this.setState({ mouseDown: true, progress: this.props.progress ? this.props.progress : 0 })
  };
  handleMouseUp = async (event) => {
    console.log('handleMouseUp');
    if (this.props.onClick) {
      await this.props.onClick(event);
    }

    this.setState({ mouseDown: false });
  };

  handleMouseMove = (event) => {
    console.log('handleMouseMove');
    if (this.state.mouseDown) {
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
        height: this.props.height
      }} onMouseMove={this.handleMouseMove}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}>
        <div className={styles.inner} style={{
          backgroundColor: this.props.innerBackground ? this.props.innerBackground : '#b3b3b3',
          width: `${this.state.mouseDown ? this.state.progress : (this.props.progress ? this.props.progress : 0)}%`
        }}></div>
      </div>
    );
  }
}

export default Progress;