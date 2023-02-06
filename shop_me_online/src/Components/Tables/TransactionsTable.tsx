import React, { useState } from "react";
import '../../Pages/ShipOrders.css';

//apollo and graphql
import { useQuery } from "@apollo/client";
import { GET_TRANSACTIONS } from "../../Queries/Queries";

//material ui
import { DataGrid, GridColDef } from '@mui/x-data-grid';

//interface
import { Transaction } from "../../Pages/Home";

interface MyProps {
    setSelectedTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>
}

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 300 },
    { field: 'address', headerName: 'Address', width: 130 },
    {
      field: 'paid',
      headerName: 'Paid',
      type: 'boolean',
      width: 90
    },
    {
      field: 'ordering_time',
      headerName: 'Ordering time',
      width: 110
    },
    {
        field: 'sum',
        headerName: 'ordered_items',
        width: 120
    }
];

export const TransactionsTable: React.FC<MyProps> = ({setSelectedTransactions}) => {
    //states
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    
    //queries
    useQuery(GET_TRANSACTIONS, {
        onCompleted(data) {
            let temp: Transaction[] = data.getTransactions;
            temp = temp.map((item) => {
                let fixed_time = (Number)(item.ordering_time.slice(0, -3));
                const timestamp_to_date = new Date(fixed_time * 1000);
                return {
                    ...item,
                    ordering_time: `${timestamp_to_date.getFullYear()}-${(timestamp_to_date.getMonth() + 1) >= 10 ? timestamp_to_date.getMonth() + 1 : `0${timestamp_to_date.getMonth() + 1}`}-${timestamp_to_date.getDate() >= 10 ? timestamp_to_date.getDate() : `0${timestamp_to_date.getDate()}`}`
                }
            });

            setTransactions([...temp]);
        }
    });

    return (
        <div className="transaction_table_container">
            <p className="secondary_headlines">Select transactions to ship:</p>
            
            <div style={{ height: 400, width: 820, margin: 'auto' }}>
            <DataGrid
            rows={transactions}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            onSelectionModelChange={(ids) => {
                const selectedIDs = new Set(ids);
                const selectedRowsData = transactions.filter((row) =>
                    selectedIDs.has(row.id)
                );

                setSelectedTransactions(selectedRowsData);
            }}
            />
            </div>
        </div>
    );
}