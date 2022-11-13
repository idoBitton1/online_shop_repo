import React from "react";

//material ui
import { Button } from "@mui/material";

//icons
import {GiConverseShoe} from 'react-icons/gi';
import {FaTshirt} from 'react-icons/fa';
import {GiShorts} from 'react-icons/gi';
import {GiMonclerJacket} from 'react-icons/gi';
import {GiLabCoat} from 'react-icons/gi';
import {GiDress} from 'react-icons/gi';
import {BsFillHandbagFill} from 'react-icons/bs';

interface CategoryStyle{
    icon: JSX.Element,
    category_name: string
    onClickFunc?: () => void //delete ? later
}

export const CatergoriesBar = () => {

    //categories array
    const categories_array: CategoryStyle[] = [
        {
            icon: <GiConverseShoe className="category_icon"/>,
            category_name: "Shoes"
        },
        {
            icon: <FaTshirt className="category_icon"/>,
            category_name: "Shirts"
        },
        {
            icon: <GiShorts className="category_icon"/>,
            category_name: "shorts"
        },
        {
            icon: <GiMonclerJacket className="category_icon"/>,
            category_name: "Jackets"
        },
        {
            icon: <GiLabCoat className="category_icon"/>,
            category_name: "Coats"
        },
        {
            icon: <GiDress className="category_icon"/>,
            category_name: "Dresses"
        },
        {
            icon: <BsFillHandbagFill className="category_icon"/>,
            category_name: "Bags"
        }
    ];

    //sort the categories array
    categories_array.sort((a, b) => {
        if(a.category_name < b.category_name)
            return -1;
        else if(a.category_name > b.category_name)
            return 1;
        else
            return 0;
    })

    return(
        <div className="categories_container">
            {categories_array.map((item) => {
                return(
                    <Button className="category_style" 
                    sx={{textTransform: "none", color: "gray", marginLeft: 3, fontFamily: "Rubik"}}>
                        {item.icon}
                        {item.category_name} 
                    </Button>
                )
            })}
        </div>
    )
}