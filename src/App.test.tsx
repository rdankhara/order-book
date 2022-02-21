import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './app';
import {Wrapped} from "./shared/testUtils";
import {initialState} from "./features/orderBook/reducers/ordersState";

describe('App component', () => {

    test('renders header', () => {
        const rootState = {
            orderBook: initialState
        }

        render(<Wrapped initialState={rootState} ><App /></Wrapped>);
        const header = screen.getByText(/Coinbase Order Book/i);
        expect(header).toBeInTheDocument();
    });
});
