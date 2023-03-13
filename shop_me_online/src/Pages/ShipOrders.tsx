import React, { useState } from "react";
import './ShipOrders.css';

//Apollo and graphql
//only in this component, the query will be sent to the algorithm server
import { useLazyQuery } from "@apollo/client";
import { GET_MINIMUM_SHIPMENT_COST } from "../Queries/Queries";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

//components
import { Header } from "../Components/Header/Header";
import { TransactionsTable } from "../Components/Tables/TransactionsTable";
import { ChooseWarehouse } from "../Components/Tables/ChooseWarehouse";

//material-ui
import { Button } from "@mui/material"

//interface
import { TransactionSecondType } from "./Home";
import { DisplayResults } from "../Components/Tables/DisplayResults";

export interface Warehouse {
    name: string,
    address: string
}

export interface Result {
    result_matrix: number[][],
    total_cost: number
}

//type declare
type reduced = {
    address: string,
    sum: number
}

const manage_db_client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "http://localhost:4000/graphql"
  });

const ShipOrders = () => {
    //states
    const [selected_transactions, setSelectedTransactions] = useState<TransactionSecondType[]>([]);
    const [selected_warehouses, setSelectedWarehouses] = useState<Warehouse[]>([]);
    const [result, setResult] = useState<Result | null>(null);

    //queries
    const [getMinimumShipmentCost] = useLazyQuery(GET_MINIMUM_SHIPMENT_COST, {
        fetchPolicy: "network-only",
        onCompleted(data) {
            setResult({
                result_matrix: data.getMinimumCost.resMat,
                total_cost: data.getMinimumCost.totalCost
            });
        },
    });


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
            }
            else { //if found, add it to the sum
                reduced_transactions[found_index].sum += selected_transactions[i].sum;
            }
        }

        //push into the array
        reduced_transactions.map((transaction) => {
            all_demand.push(transaction.sum);

            return transaction;
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

        //if sum is odd number
        if(sum % selected_warehouses.length !== 0)
            all_supply[0] += sum % selected_warehouses.length;

        //allocate the costs matrix
        let costs: number[][] = Array.from(Array(all_supply.length), () => new Array(all_demand.length));     

        for (let i = 0; i < all_supply.length; i++) {
            for (let j = 0; j < all_demand.length; j++) {
                const delivery_fee = await checkDistance(selected_warehouses[i].address, reduced_transactions[j].address);

                costs[i][j] = delivery_fee;
            }   
        }     

        //get the answer from the server
        getMinimumShipmentCost({
            variables: {
                all_supply: all_supply,
                all_demand: all_demand,
                costs_mat: costs
            }
        });
    }

    const checkDistance = async(origin_address: string, destination_address: string) => {
        //setup
        const key: string = "gWROMgSB5r701uDW5UgDvE3aUQepw";
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
        <>
        <ApolloProvider client={manage_db_client}>
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

        {
            result !== null 
            ? 
            <DisplayResults
            result_matrix={result.result_matrix}
            total_cost={result.total_cost}
            selected_warehouses={selected_warehouses}
            selected_transactions={selected_transactions}
            /> 
            : 
            <></>
        }
        </ApolloProvider>
        </>
    );
}

export default ShipOrders;