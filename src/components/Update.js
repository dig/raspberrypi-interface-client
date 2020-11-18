import React from 'react';
import styles from '../assets/style/update.module.css';

const SOCKET_KEY = 'Update';

class Update extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => this.props.addSocketListener(SOCKET_KEY, 'updateState', this.handleUpdateState);
  componentWillUnmount = () => this.props.removeSocketListener(SOCKET_KEY);

  handleUpdateState = (id, state) => {
    id = Number(id);
    if (id === 1 && state !== 'true') {
      this.props.close();
    }
  }

  render() {
    return (
      <div className={styles.background}>
        Updating...
      </div>
    );
  }
}

export default Update;