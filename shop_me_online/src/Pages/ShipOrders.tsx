import React, { useState } from "react";
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

//type declare
type reduced = {
    address: string,
    sum: number
}

const ShipOrders = () => {
    //states
    const [selected_transactions, setSelectedTransactions] = useState<TransactionSecondType[]>([]);
    const [selected_warehouses, setSelectedWarehouses] = useState<Warehouse[]>([]);

    const handleShowResultsClick = async() => {
        //get all the demands
        let all_demand: number[] = [];

        //adding all the products that are sent to the same place together
        let reduced_transactions: reduced[] = [];
        for(let i = 0; i < selected_transactions.length; i++) {
            //try to find the index of the current address
            let found_index = reduced_transactions.findIndex((item) => item.address === selected_transactions[i].address);
            //if not found, create a new place in the array for that address
            if(found_index === -1) {
                reduced_transactions.push({address: selected_transactions[i].address, sum: selected_transactions[i].sum});
                continue;
            }
            reduced_transactions[found_index].sum += selected_transactions[i].sum;
        }

        //push into the array
        reduced_transactions.map((transaction) => {
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

        //allocate the costs matrix
        let costs: number[][] = Array.from(Array(all_supply.length), () => new Array(all_demand.length));     

        for (let i = 0; i < all_supply.length; i++) {
            for (let j = 0; j < all_demand.length; j++) {
                const delivery_fee = await checkDistance(selected_warehouses[i].address, reduced_transactions[j].address);

                costs[i][j] = delivery_fee;
            }   
        }     

        console.log(costs)
    }

    const checkDistance = async(origin_address: string, destination_address: string) => {
        //setup
        const key: string = "";
        let http_address = `https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${origin_address}&destinations=${destination_address}&key=${key}`;

        let delivery_fee: number = 0;

        try {
          const response = await fetch(http_address);
      
          if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
          }

          const result = await response.json();
      
          //convert from meters to km
          const distance_in_km: number = (result.rows[0].elements[0].distance.value) * 0.001;

          delivery_fee = Math.floor(distance_in_km * 1.5);
        } 
        catch (error) {
          if (error instanceof Error) {
            console.log('error message: ', error.message);
          } else {
            console.log('unexpected error: ', error);
          }
        }

        return delivery_fee;
    }

    return (
        <div className="ship_orders_container" style={{textAlign: "center"}}>
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