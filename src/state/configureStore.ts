import {combineEpics, createEpicMiddleware} from "redux-observable";
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import {ordersEpics} from "../features/orderBook/epics/ordersEpics";
import {ordersReducer} from "../features/orderBook/reducers/ordersReducer";
import {webSocket} from "rxjs/webSocket";

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootEpic = combineEpics(
    ordersEpics,
);

const rootReducer = combineReducers({
    orderBook: ordersReducer,
});

const epicMiddleware = createEpicMiddleware({dependencies: {webSocket}});

export const store = createStore(
    rootReducer,
    composeEnhancers(
        applyMiddleware(epicMiddleware)
    )
);

epicMiddleware.run(rootEpic);


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ReturnType<typeof store.dispatch>;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector