import {createAction, createEmptyAction, EmptyAction} from "../../../core/actionUtils";
import {
    UpdateProduct,
    Subscribe,
    Unsubscribe,
    OrderSnapshot,
    UpdateSnapshot, UpdateOrders, UnsubscribeAll
} from "./ordersActionTypes";

export const subscribeProduct = createAction<string>(Subscribe);
export const unsubscribeProduct = createAction<string>(Unsubscribe);
export const unsubscribeAll = createEmptyAction(UnsubscribeAll);
export const updateProduct = createAction<string>(UpdateProduct);
export const updateSnapshot = createAction<OrderSnapshot>(UpdateSnapshot);
export const updateOrders = createAction<OrderSnapshot>(UpdateOrders);

export type UpdateSnapshotActionType = ReturnType<typeof updateSnapshot>;
export type UpdateOrdersActionType = ReturnType<typeof updateOrders>;
export type SubscribeProductActionType = ReturnType<typeof subscribeProduct>;
export type UnsubscribeAllActionType = ReturnType<typeof unsubscribeAll>;
export type UpdateProductActionType = ReturnType<typeof updateProduct>;

export type OrdersActions = EmptyAction | UpdateProductActionType | UpdateOrdersActionType | UpdateSnapshotActionType | SubscribeProductActionType | UnsubscribeAllActionType;