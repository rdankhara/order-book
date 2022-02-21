import React from 'react';
import {AgGridReact} from "ag-grid-react";
import {ColDef} from "ag-grid-community/dist/lib/entities/colDef";
import {Order} from "../reducers/ordersState";
import styles from './orders.module.css';

export interface OrdersProps {
    data: Order[],
    columnDefs: ColDef [],
    title: string
}

type OrdersState = {

}

export class Orders extends React.Component<OrdersProps, OrdersState> {

    render() {
        const {data, columnDefs, title} = this.props;

        return(
            <div className="ag-theme-alpine" style={{height: 610, width: 600}}>
                <div className={styles.title}>{title}</div>
                <AgGridReact
                    cellFadeDelay={200}
                    cellFlashDelay={800}
                    gridOptions={{getRowNodeId: (data) => data.price}}
                    defaultColDef={
                        {enableCellChangeFlash: true, flex: 1}
                    }
                    rowData={data}
                    rowBuffer={50}
                    columnDefs={columnDefs}
                    rowHeight={35}
                    enableCellChangeFlash={true}
                    immutableData={true}
                    viewportRowModelBufferSize={50}
                >
                </AgGridReact>
            </div>
        )
    }
}