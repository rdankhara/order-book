import {ConnectionStatus} from "../connectionStatus";
import {render, screen} from "@testing-library/react";
import React from "react";

describe('connectionStatus component', () => {
    it('Renders disconnected', () => {
        render(<ConnectionStatus isConnected={false} />);
        const element = screen.getByText(/connection status/i);
        expect(element).toBeInTheDocument();

        const statusIndicator = screen.getByTestId(/connectionStatus/);
        expect(statusIndicator).toHaveClass('disconnected');
    });

    it('Renders connected indication when status is connected', () => {
        render(<ConnectionStatus isConnected={true} />);

        expect(screen.getByTestId(/connectionStatus/)).toHaveClass('connected');
    })
})