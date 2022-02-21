import React from 'react';
import {Provider} from "react-redux";
import configureStore from 'redux-mock-store';

interface WrappedProps {
    initialState: any
    children: JSX.Element
}

export const Wrapped = (props: WrappedProps) => {
    const middlewares: any[] = [];
    const mockStore = configureStore(middlewares)
    const store = mockStore(props.initialState);
    return (
        <Provider store={store}>
            {props.children}
        </Provider>
    )
}