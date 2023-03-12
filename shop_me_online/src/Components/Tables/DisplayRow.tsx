import React from "react";
import '../../Pages/ShipOrders.css';

//components
import { DisplayCell } from "./DisplayCell";

interface MyProps {
    row_name: string,
    row_values: number[]
}

export const DisplayRow: React.FC<MyProps> = ({row_name, row_values}) => {

    return (
        <div className="display_flex">
            <DisplayCell text={row_name} />

            {
                row_values !== undefined
                ?
                row_values.map((value, i) => <DisplayCell text={value} key={i} />)
                :
                <></>
            }
        </div>
    );
}