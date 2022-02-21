import React, {memo} from 'react';
import cn from "classnames";
import styles from "./connectionStatus.module.css";

interface ConnectionStatusProps {
    isConnected : boolean;
}

export const ConnectionStatus =memo( ({isConnected}: ConnectionStatusProps) => {
    return (
        <div className={styles.statusWrapper}>
            <span>connection status</span>
            <span data-testid={'connectionStatus'} className={cn({[styles.connected]: isConnected, [styles.disconnected]: !isConnected})}></span>
        </div>
    )
}, (
    (prevProps, nextProps) =>
    prevProps.isConnected === nextProps.isConnected)
);