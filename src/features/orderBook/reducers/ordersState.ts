export type Order = {
    price: number;
    qty: number;
    count: number;
}

export type OrdersState = {
    product: string;
    buyOrders: Order[];
    sellOrders: Order[];
    isConnected: boolean;
    lastUpdated?: Date;
}

export const initialState: OrdersState = {
    product: '',
    buyOrders: [],
    sellOrders :[],
    isConnected: false,
}

