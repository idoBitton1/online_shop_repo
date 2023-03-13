import React, { useState } from "react";
import '../../Pages/ShipOrders.css';

//apollo and graphql
import { useQuery } from "@apollo/client";
import { GET_TRANSACTIONS } from "../../Queries/Queries";

//material ui
import { DataGrid, GridColDef } from '@mui/x-data-grid';

//interface
import { TransactionSecondType } from "../../Pages/Home";

interface MyProps {
    setSelectedTransactions: React.Dispatch<React.SetStateAction<TransactionSecondType[]>>
}

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 300 },
    { field: 'address', headerName: 'Address', width: 130 },
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
    const [transactions, setTransactions] = useState<TransactionSecondType[]>([]);
    
    //queries
    useQuery(GET_TRANSACTIONS, {
        fetchPolicy: "network-only",
        onCompleted(data) {
            let temp: TransactionSecondType[] = data.getTransactions;
            temp = temp.map((item) => {
                //show the date
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
            
            <div style={{ height: 371, width: 720, margin: 'auto' }}>
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