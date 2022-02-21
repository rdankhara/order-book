import {RootState} from "./configureStore";
import {createSelector} from "reselect";
import {OrdersState} from "../features/orderBook/reducers/ordersState";

export const selectOrderBook = (state: RootState) => state.orderBook as OrdersState;

export const selectProduct = createSelector( selectOrderBook, o => o.product);
export const selectSellOrders = createSelector( selectOrderBook, o => o.sellOrders || []);
export const selectBuyOrders = createSelector(selectOrderBook, o => o.buyOrders || []);
export const selectIsConnected = createSelector(selectOrderBook, o => o.isConnected);
export const selectLastUpdated = createSelector(selectOrderBook, o => o.lastUpdated);