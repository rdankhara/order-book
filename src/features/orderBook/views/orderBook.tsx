import React from 'react';

import {Selector} from "../../../shared/components/selector/selector";
import {connect} from "react-redux";
import {RootState} from "../../../state/configureStore";
import {subscribeProduct, unsubscribeAll, updateProduct} from "../reducers/ordersActions";
import {
    selectBuyOrders,
    selectIsConnected,
    selectLastUpdated,
    selectProduct,
    selectSellOrders
} from "../../../state/selectors";
import {Order} from "../reducers/ordersState";
import {Orders} from "./orders";

import styles from './orderBook.module.css';
import {ConnectionStatus} from "../../../shared/components/connectionStatus/connectionStatus";
import {formatDate} from "../../../core/dateTimeUtils";

export interface OrderBookProps {
    product?: string;
    buyOrders: Order[];
    sellOrders: Order[];
    lastUpdated?: Date;
    isConnected: boolean;
    subscribeProduct: (payload: string) => void;
    unsubscribeAll: () => void;
    updateProduct: (product: string) => void;
}

const products = ['BTC-USD', 'BTC-EUR', 'ETH-USD', 'ETH-EUR'];

export class OrderBook extends React.Component<OrderBookProps, any> {

    onProductChanged = (value: string) => {
        const {updateProduct, subscribeProduct } = this.props;
        updateProduct(value);
        subscribeProduct(value);
    }

    startStreaming = () => {
        const{subscribeProduct, product} = this.props;
        product && subscribeProduct?.(product);
    }

    canStream = () => {
        const {isConnected, product} = this.props;
        return (!isConnected && !!product);
    }

    stopUpdate = () => {
        this.props.unsubscribeAll();
    }

    selector = (x: string) => x;

    render() {
        const {product, isConnected, lastUpdated} = this.props;
        return (
            <div className={styles.container}>
                <div className={styles.productSelectionContainer}>
                    <label className={styles.label} htmlFor={'product-selector'}>Product</label>
                    <Selector name={'product-selector'} data={products} selectedValue={product} displayTextSelector={this.selector} valueSelector={this.selector} onSelect={this.onProductChanged} />
                    <ConnectionStatus isConnected={isConnected} />
                    <button className={styles.startButton} onClick={this.startStreaming} disabled={!this.canStream()}>Start Streaming</button>
                    <button className={styles.stopButton} onClick={this.stopUpdate} disabled={!isConnected}>Stop Streaming</button>
                </div>
                <div>
                    {!product && <b>Please select a product to start getting updated orders</b>}
                    {(!isConnected && !!product) && <b>Press Start Streaming button to start getting updated orders</b>}
                </div>
                <div className={styles.lastUpdateWrapper}>
                    <span>last updated at</span>
                    <span>{lastUpdated && formatDate(lastUpdated)}</span>
                </div>
                <div className={styles.orderBookWrapper}>
                    <Orders title={'Buy Orders'} data={this.props.buyOrders} columnDefs={[{field: 'count'}, {field: 'qty'}, {field: 'price', sortingOrder: ['desc']}]} />
                    <Orders title={'Sell Orders'} data={this.props.sellOrders} columnDefs={[{field: 'price', sortingOrder: ["asc"]}, {field: 'qty'}, {field: 'count'}]} />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state: RootState) => {
    const product= selectProduct(state);
    const buyOrders = selectBuyOrders(state) || [];
    const sellOrders = selectSellOrders(state) || [];
    return {
        product,
        buyOrders,
        sellOrders,
        isConnected: selectIsConnected(state),
        lastUpdated: selectLastUpdated(state)
    }
}

export const ConnectedOrderBook = connect(
    mapStateToProps,
    ({subscribeProduct, unsubscribeAll, updateProduct})
)(OrderBook);