import React, { useState } from "react";
import './ShipOrders.css';

//components
import { Header } from "../Components/Header/Header";
import { TransactionsTable } from "../Components/Tables/TransactionsTable";
import { ChooseWarehouse } from "../Components/Tables/ChooseWarehouse";

//material-ui
import { Button } from "@mui/material"

//interface
import { Transaction } from "./Home";

export interface Warehouse {
    name: string,
    address: string
}

const ShipOrders = () => {
    //states
    const [selected_transactions, setSelectedTransactions] = useState<Transaction[]>([]);
    const [selected_warehouses, setSelectedWarehouses] = useState<Warehouse[]>([]);

    const handleShowResultsClick = () => {
        
    }

    return (
        <div className="ship_orders_container">
            <Header />

            <h1 className="headline"> Ship Orders </h1>

            <div className="ship_orders_context">
                <div className="tables">
                <TransactionsTable
                    setSelectedTransactions={setSelectedTransactions}
                    />
                    <ChooseWarehouse 
                    setSelectedWarehouses={setSelectedWarehouses}
                    />

                                  
                </div>

                <Button
                variant="contained"
                onClick={handleShowResultsClick}
                sx={{width: "fit-content", alignSelf: "center", marginTop: 15}}>
                    Show results
                </Button>
            </div>
        </div>
    );
}

export default ShipOrders;