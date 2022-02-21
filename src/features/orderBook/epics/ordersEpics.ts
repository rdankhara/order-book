import {
    bufferTime,
    filter,
    merge, of,
    switchMap, takeUntil
} from "rxjs";
import {webSocket} from "rxjs/webSocket";
import {ofType} from "redux-observable";
import {
    ChannelType, ClosedConnection,
    OrderRequestTypes,
    OrderResponseTypes,
    OrderSnapshot,
    ProductSubscription,
    ProductUnSubscription,
    Subscribe,
    UnsubscribeAll,
    UpdateSnapshot
} from "../reducers/ordersActionTypes";
import {map} from "rxjs/operators";
import {Order} from "../reducers/ordersState";
import {PayloadAction} from "../../../core/actionUtils";
import {updateOrders, UpdateSnapshotActionType} from "../reducers/ordersActions";

const createSubscriptionRequest = (productId: string): ProductSubscription => {
    return {type: OrderRequestTypes.Subscribe, channels: [{name: ChannelType.level2, product_ids:[productId]}]};
}

const createUnsubscribeRequest = (productId: string):ProductUnSubscription => {
    return {type: OrderRequestTypes.UnSubscribe, channels: [{name: ChannelType.level2, product_ids:[productId]}]};
}

interface Response  {
    type: OrderResponseTypes;
}

interface SnapshotResponse extends Response {
    type : OrderResponseTypes.Snapshot,
    time: string,
    bids: [string[]];
    asks: [string[]];
}

type Change = ['buy' | 'sell', string, string];

interface UpdateResponse {
    type: OrderResponseTypes.Update;
    changes: Change[];
    product_id: string;
}

export const ordersEpics = (actions$: any, state$: any, dependency: any) => {
    const url = 'wss://ws-feed.exchange.coinbase.com';

    return actions$.pipe(
        ofType (Subscribe),
        switchMap((action) => {
            const subject = dependency.webSocket(url);
            const productId = (action as PayloadAction<string>).payload;
            const request = createSubscriptionRequest(productId);

            subject.next(createUnsubscribeRequest(productId));
            subject.next(request)

            const stream$ = subject.asObservable();

            const snapshotStream$ = stream$.pipe(
                filter( (x) => ((x as Response).type=== OrderResponseTypes.Snapshot)),
                map((value, index) => {
                    const response = value as SnapshotResponse;
                    const snapshot =  {
                        type: UpdateSnapshot,
                        payload: {
                            bids: response.bids.map(x => ({
                                price: parseFloat(x[0]),
                                qty: parseFloat(x[1]),
                                count: 1
                            } as Order)).filter(x => x.qty !== 0),
                            asks: response.asks.map(x => ({
                                price: parseFloat(x[0]),
                                qty: parseFloat(x[1]),
                                count: 1
                            } as Order)).filter(x => x.qty !== 0),
                        }  as OrderSnapshot
                    } as UpdateSnapshotActionType;

                    return snapshot;
                }),
                takeUntil(actions$.pipe(ofType(UnsubscribeAll)))
            );

            const updateStream$ = stream$.pipe(
                filter( (x) => ((x as Response).type=== OrderResponseTypes.Update)),
                bufferTime(1000 ),
                map(x => {
                    const updates = x as UpdateResponse[];
                    const payload: OrderSnapshot = updates.flatMap(u => u.changes)
                        .reduce((a, c) => {
                            const [bs, price, qty] = c;

                            const order: Order = {price: parseFloat(price), qty: parseFloat(qty), count: 1};
                            if (bs === 'buy') {
                                a.bids.push(order)
                            } else
                            {
                                a.asks.push(order);
                            }
                            return a;
                        }, {bids: [], asks: [], time: ''} as OrderSnapshot);

                        const result = updateOrders(payload);

                    return result;
                }),
                takeUntil(actions$.pipe(ofType(UnsubscribeAll)))
            );

            const unsubscribe = actions$.pipe(
                ofType(UnsubscribeAll),
                switchMap((action) => {
                    subject.complete();
                    return of({type: ClosedConnection});
                }),
            )
            return merge(snapshotStream$, updateStream$, unsubscribe);
        }),
    )
}