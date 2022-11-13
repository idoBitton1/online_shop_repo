import React, {useState} from "react";

//material ui
import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";

//icons
import CircleIcon from '@mui/icons-material/Circle';
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

interface Filters{
    color: string,
    season: string
}

const chooseCurrentSeason = ():string => {
    const current_date = new Date();

    const current_month = current_date.getMonth() + 1;

    if(current_month === 12 || current_month === 1 || current_month === 2)
        return "winter";
    else if(current_month >= 3 && current_month <= 5)
        return "spring";
    else if(current_month >= 6 && current_month <= 8)
        return "summer";
    else
        return "autumn"
}

export const CatergoriesBar = () => {

    const [filters, setFilters] = useState<Filters>({
        color: "any",
        season: chooseCurrentSeason()
    });

    //colors array
    const colors_array: string[] = [
        "any", "black", "blue", "green"
    ]

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

    const handleColorChange = (event: SelectChangeEvent) => {
        setFilters((prev) => {
            return {
                color: event.target.value as string,
                season: prev.season
            }
        })
    }

    const handleSeasonChange = (event: SelectChangeEvent) => {
        setFilters((prev) => {
            return {
                color: prev.color,
                season: event.target.value as string
            }
        })
    }

    return(
        <div className="navigation_bar">
            <div>
            {categories_array.map((item, i) => {
                return(
                    <Button key={i} className="category_style" 
                    sx={{textTransform: "none", color: "gray", marginLeft: 3, fontFamily: "Rubik"}}>
                        {item.icon}
                        {item.category_name} 
                    </Button>
                )
            })}
            </div>

            <div>
            <FormControl variant="standard" sx={{width: 150, marginRight: 3}}>
                <InputLabel>Color</InputLabel>
                <Select
                id="color_select"
                value={filters.color}
                label="Color"
                onChange={handleColorChange}
                >
                {
                    colors_array.map((colorI, i) => {
                        if(colorI === "any")
                            return(
                                <MenuItem key={i} value={"any"}>any</MenuItem>
                            )
                        else
                            return (
                                <MenuItem key={i} value={colorI}>{colorI}{<CircleIcon sx={{marginLeft: "auto", color: colorI, marginBottom: -1}} />}</MenuItem>
                            )
                    })
                }
                </Select>
            </FormControl>

            <FormControl variant="standard" sx={{width: 120}}>
                <InputLabel>Season</InputLabel>
                <Select
                id="season_select"
                value={filters.season}
                label="Season"
                onChange={handleSeasonChange}
                >
                <MenuItem value={"spring"}>spring</MenuItem>
                <MenuItem value={"summer"}>summer</MenuItem>
                <MenuItem value={"autumn"}>autumn</MenuItem>
                <MenuItem value={"winter"}>winter</MenuItem>
                </Select>
            </FormControl>
            </div>
        </div>
    )
}