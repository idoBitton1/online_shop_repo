import React, {Dispatch, SetStateAction, useEffect, useState} from "react";

//material ui
import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

//interface
import { Product } from "../../App";

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
    category: string
    color: string,
    season: string
}

interface MyProps{
    products: Product[],
    filtered_products: Product[],
    setFilteredProducts: Dispatch<SetStateAction<Product[]>>
}

export const NavigationBar: React.FC<MyProps> = ({products, filtered_products, setFilteredProducts}) => {

    const [open_dialog, setOpenDialog] = useState<boolean>(false);

    const [filters, setFilters] = useState<Filters>({
        category: "any_category",
        color: "any_color",
        season: "any_season"
    });

    //colors array
    const colors_array: string[] = [
        "any", "black", "blue", "green"
    ]

    //categories array
    const categories_array: CategoryStyle[] = [
        {
            icon: <GiConverseShoe className="category_icon"/>,
            category_name: "shoes"
        },
        {
            icon: <FaTshirt className="category_icon"/>,
            category_name: "shirts"
        },
        {
            icon: <GiShorts className="category_icon"/>,
            category_name: "shorts"
        },
        {
            icon: <GiMonclerJacket className="category_icon"/>,
            category_name: "jackets"
        },
        {
            icon: <GiLabCoat className="category_icon"/>,
            category_name: "coats"
        },
        {
            icon: <GiDress className="category_icon"/>,
            category_name: "dresses"
        },
        {
            icon: <BsFillHandbagFill className="category_icon"/>,
            category_name: "bags"
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

    const handleCategoryChange = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setFilters((prev) => {
            if(prev.category === event.currentTarget.value as string)
                return {
                    category: "any_category",
                    color: prev.color,
                    season: prev.season
                }
            else
                return {
                    category: event.currentTarget.value as string,
                    color: prev.color,
                    season: prev.season
                }
        });
    }

    const handleColorChange = (event: SelectChangeEvent) => {
        setFilters((prev) => {
            return {
                category: prev.category,
                color: event.target.value as string,
                season: prev.season
            }
        });
    }

    const handleSeasonChange = (event: SelectChangeEvent) => {
        setFilters((prev) => {
            return {
                category: prev.category,
                color: prev.color,
                season: event.target.value as string
            }
        });
    }

    //filter the products array by the filters object,
    //and everytime a filter is changed, refilter the products 
    //array and place the filtered array in the filtered_array
    useEffect(() => {
        filterProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.category])

    const toggleDialog = () => {
        setOpenDialog((prev) => !prev);
    }

    const handleFilterClick = () => {
        filterProducts();

        toggleDialog();
    }

    const filterProducts = () => {
        setFilteredProducts(products);
        
        setFilteredProducts((prev) => {
            return prev.filter((product) => {
                return (
                (filters.category === "any_category" ? true : product.categories.includes(filters.category)) &&
                (filters.color === "any_color" ? true : product.categories.includes(filters.color)) &&
                (filters.season === "any_season" ? true : product.categories.includes(filters.season))
                );
            })
        })
    }

    return(
        <>
        <div className="navigation_bar">
            <div>
            {categories_array.map((item, i) => {
                return(
                    <Button key={i} 
                    className="category_style"
                    value={item.category_name}
                    onClick={handleCategoryChange}
                    sx={{textTransform: "none", marginLeft: 3, fontFamily: "Rubik", 
                        color: item.category_name === filters.category ? "black" : "gray"
                    }}
                    >
                        {item.icon}
                        {item.category_name} 
                    </Button>
                )
            })}
            </div>

            <button onClick={toggleDialog}>toggle</button>
        </div>

        <Dialog open={open_dialog} onClose={toggleDialog}>
            <DialogTitle>
                Filters
            </DialogTitle>

            <DialogContent>
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
                                <MenuItem key={i} value={"any_color"}>any</MenuItem>
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
                <MenuItem value={"any_season"}>any</MenuItem>
                <MenuItem value={"spring"}>spring</MenuItem>
                <MenuItem value={"summer"}>summer</MenuItem>
                <MenuItem value={"autumn"}>autumn</MenuItem>
                <MenuItem value={"winter"}>winter</MenuItem>
                </Select>
            </FormControl>
            </div>
            <Button onClick={handleFilterClick}>
                Filter!
            </Button>
            </DialogContent>
        </Dialog>
        </>
    )
}