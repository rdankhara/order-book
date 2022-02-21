import React from 'react';
import styles from './app.module.css';
import {ConnectedOrderBook} from "./features/orderBook/views/orderBook";

function App() {
  return (
    <div className={styles.App}>
      <header className={styles.appHeader}>
        <span className={styles.title}>Coinbase Order Book</span>
      </header>
        <ConnectedOrderBook />
    </div>
  );
}

export default  App;