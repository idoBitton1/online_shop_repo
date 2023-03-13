import React from "react";
import '../../Pages/ShipOrders.css';

//components
import { DisplayCell } from "./DisplayCell";

interface MyProps {
    column_values: string[] | number[]
}

export const DisplayColumn: React.FC<MyProps> = ({column_values}) => {

    return (
        <div className="display_flex_column">
            {
                column_values !== undefined
                ?
                column_values.map((value, i) => <DisplayCell text={value} key={i} />)
                :
                <></>
            }
        </div>
    );
}