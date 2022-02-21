import {createActionGroup} from "../../../core/actionUtils";
import {Order} from "./ordersState";

export enum ChannelType {
    level2 = 'level2'
}

export interface Channel {
    name: ChannelType,
    product_ids: string[]
}

export enum OrderRequestTypes {
    Subscribe = 'subscribe',
    UnSubscribe = 'unsubscribe',
}

export enum OrderResponseTypes {
    Snapshot = 'snapshot',
    Update = 'l2update',
    Subscriptions = 'subscriptions'
}

export type OrderSnapshot = {
    bids: Order[],
    asks: Order[],
    time: string
}

const createOrdersAction = createActionGroup('ORDERS');

export const Subscribe = createOrdersAction('SUBSCRIBE');
export const Unsubscribe = createOrdersAction('UNSUBSCRIBE');
export const UnsubscribeAll = createOrdersAction('UNSUBSCRIBE_ALL');
export const UpdateProduct = createOrdersAction('UPDATE_PRODUCT');
export const UpdateSnapshot = createOrdersAction('SNAPSHOT');
export const UpdateOrders = createOrdersAction('UPDATE_ORDERS');
export const ClosedConnection = createOrdersAction('CLOSED_CONNECTION');

export interface ProductSubscription {
    type: OrderRequestTypes.Subscribe,
    channels: Channel[]
}

export interface ProductUnSubscription {
    type: OrderRequestTypes.UnSubscribe,
    channels: Channel[]
}
