import React from "react";
import '../../Pages/ShipOrders.css';

//material ui
import { DataGrid, GridColDef } from '@mui/x-data-grid';

//interface
import { Warehouse } from "../../Pages/ShipOrders";

interface MyProps {
    setSelectedWarehouses: React.Dispatch<React.SetStateAction<Warehouse[]>>
}

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'address', headerName: 'Address', width: 200 }
];

const rows = [
    { id: 1, name: "First warehouse", address: "Dizengoff, Tel-Aviv, Israel" },
    { id: 2, name: "Second warehouse", address: "Agmon, Haifa, Israel" },
    { id: 3, name: "Third warehouse", address: "Mendelson, Be'er sheva, Israel" }
];

export const ChooseWarehouse: React.FC<MyProps> = ({setSelectedWarehouses}) => {

    return (
        <div className="warehouse_table_container">
            <p className="secondary_headlines">Select a warehouse to ship from:</p>

            <div style={{ height: 267, width: 460, margin: 'auto' }}>
            <DataGrid
            rows={rows}
            columns={columns}
            pageSize={3}
            rowsPerPageOptions={[3]}
            checkboxSelection
            onSelectionModelChange={(ids) => {
                const selectedIDs = new Set(ids);
                //filter the array to get only the selected rows, and take only the address field
                const selectedRowsData = rows.filter((row) =>
                    selectedIDs.has(row.id)
                ).map((row) => {
                    return {
                        name: row.name,
                        address: row.address
                    };
                });

                setSelectedWarehouses(selectedRowsData);
            }}
            />
            </div>
        </div>
    );
}