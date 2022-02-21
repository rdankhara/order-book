import produce from "immer";
import {OrderSnapshot, UnsubscribeAll, UpdateOrders, UpdateProduct, UpdateSnapshot} from "./ordersActionTypes";
import {Reducer} from "react";
import {
    OrdersActions,
    UpdateOrdersActionType,
    updateProduct,
    UpdateProductActionType,
    UpdateSnapshotActionType
} from "./ordersActions";
import {initialState, Order, OrdersState} from "./ordersState";

export interface OrderChange {
    changes: [string[]];
    product_id: string;
    type: 'l2update'
}


export const ordersReducer: Reducer<OrdersState, OrdersActions> = produce((draft: OrdersState = initialState, action:OrdersActions) => {
    switch (action.type) {
        case UpdateProduct:
            draft.product = (action as UpdateProductActionType).payload;
            break;
        case UpdateSnapshot:
            const value: OrderSnapshot =  (action as UpdateSnapshotActionType).payload;
            draft.sellOrders = value.asks;
            draft.buyOrders = value.bids;
            draft.isConnected = true;
            draft.lastUpdated = new Date();
            break;
        case UpdateOrders:
            const updates = (action as UpdateOrdersActionType).payload;
            updateOrders(draft, updates);
            draft.isConnected = true;
            draft.lastUpdated = new Date();
            break;
        case UnsubscribeAll:
            draft.isConnected = false;
            break;
        default:
            return draft;
    }
});

const updateOrders = (draft: OrdersState, payload: OrderSnapshot) => {
    mergeOrders(draft.buyOrders, payload.bids);
    mergeOrders(draft.sellOrders, payload.asks);
}
const mergeOrders = (orders: Order[], updates: Order[]) => {
    updates.forEach(x => {
        const index = orders.findIndex(v => v.price === x.price)
        if (index >= 0) {
            if (x.qty === 0) {
                orders.splice(index, 1);
            } else {
                const e = orders[index];
                orders[index] = {...e, qty: x.qty + e.qty, count: e.count + x.count}
            }
        } else {
            orders.push(x);
        }
    });
}