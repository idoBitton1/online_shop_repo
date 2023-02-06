import React, { useEffect, useState } from "react";
import './ShipOrders.css';

//components
import { Header } from "../Components/Header/Header";
import { TransactionsTable } from "../Components/Tables/TransactionsTable";
import { ChooseWarehouse } from "../Components/Tables/ChooseWarehouse";

//material-ui
import { Button } from "@mui/material"

//interface
import { TransactionSecondType } from "./Home";

export interface Warehouse {
    name: string,
    address: string
}

const ShipOrders = () => {
    //states
    const [selected_transactions, setSelectedTransactions] = useState<TransactionSecondType[]>([]);
    const [selected_warehouses, setSelectedWarehouses] = useState<Warehouse[]>([]);

    const handleShowResultsClick = () => {
        //get all the demands
        let all_demand: number[] = [];

        //push into the array
        selected_transactions.map((transaction) => {
            all_demand.push(transaction.sum);
        });

        //get all the right amount to supply
        let all_supply: number[] = [];
        let sum = 0;

        //get the sum 
        all_demand.map((item) => sum+=item);

        //spread evenly
        for(let i = 0; i < selected_warehouses.length; i++) {
            all_supply.push(Math.floor(sum / selected_warehouses.length));
        }
        

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
                sx={{width: "fit-content", alignSelf: "center", marginTop: 12}}>
                    Show results
                </Button>
            </div>
        </div>
    );
}

export default ShipOrders;