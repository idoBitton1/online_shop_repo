import React from "react";
import '../../Pages/ShipOrders.css';

//interface
import { Result, Warehouse } from "../../Pages/ShipOrders";
import { DisplayCell } from "./DisplayCell";
import { DisplayRow } from "./DisplayRow";

interface MyProps extends Result {
    selected_transactions_addresses: string[],
    selected_warehouses: Warehouse[]
}

export const DisplayResults: React.FC<MyProps> = ({result_matrix, total_cost, selected_transactions_addresses, selected_warehouses}) => {

    return (
        <div className="results_container">
            <div className="result_table">
                <div className="display_flex">
                    <DisplayCell text={""} />
                    {selected_transactions_addresses.map((address, i) => <DisplayCell text={address} key={i} />)}
                </div>

                {
                    selected_warehouses.map((item, i) => {
                        return <DisplayRow row_name={item.name} row_values={result_matrix[i]} key={i} />
                    })
                }
            </div>

            <h2 className="total_cost_text">total cost: {total_cost}</h2>
        </div>
    );
}