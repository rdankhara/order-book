import {ordersReducer} from "../../reducers/ordersReducer";
import {initialState, Order} from "../../reducers/ordersState";
import {unsubscribeAll, updateProduct, updateSnapshot} from "../../reducers/ordersActions";
import {OrderSnapshot} from "../../reducers/ordersActionTypes";

describe('OrdersReducer', () => {
    let defaultState: ReturnType<typeof ordersReducer>;

    beforeEach(() => {
        defaultState = ordersReducer(initialState, {type: ''});
    })

    it('passes initial state when action type is not handled', () => {
        expect(defaultState).toEqual({ product: '', buyOrders: [], sellOrders: [], isConnected: false });
    })

    it('updates product for updateProduct action', () => {
        expect(defaultState.product).toEqual('');
        const newState = ordersReducer(defaultState, updateProduct('ETH-EUR'));
        expect(newState.product).toBe('ETH-EUR');
    })

    it('updates snapshot', () => {
        const bids: Order[] = [{price: 100, qty: 2, count: 1}, {price: 99.99, qty: 3.38, count: 1}];
        const asks: Order[] = [{price: 100.23, qty: 5, count: 1}, {price: 100.25, qty: 10, count: 1}];
        const snapshot: OrderSnapshot = {bids, asks, time: new Date().toString()};

        const newState = ordersReducer(initialState, updateSnapshot(snapshot));
        expect(newState.isConnected).toBe(true);
        expect(newState.buyOrders).toEqual(bids);
        expect(newState.sellOrders).toEqual(asks);
    })

    it('updates status to disconnected when unsubscribe', () => {
        const newState = ordersReducer(initialState, unsubscribeAll());
        expect(newState.isConnected).toBe(false);
    })
})