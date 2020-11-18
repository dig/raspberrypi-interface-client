import React from 'react';
import styles from '../assets/style/update.module.css';

const SOCKET_KEY = 'Update';

class Update extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => this.props.addSocketListener(SOCKET_KEY, 'update_state', this.handleUpdateState);
  componentWillUnmount = () => this.props.removeSocketListener(SOCKET_KEY);

  handleUpdateState = (id, state) => {
    id = Number(id);
    state = Boolean(state);
    if (id === 1 && !state) {
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