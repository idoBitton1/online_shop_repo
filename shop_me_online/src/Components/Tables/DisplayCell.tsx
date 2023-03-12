import React from "react";
import '../../Pages/ShipOrders.css';

interface MyProps {
    text: string | number
}

export const DisplayCell: React.FC<MyProps> = ({text}) => {

    return (
        <div className="cell">
            {text}
        </div>
    );
}