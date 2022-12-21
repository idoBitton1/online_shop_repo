import React, { useEffect, useState } from "react";

//redux
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionsCreators } from '../../state';

//material ui
import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

//interface
import { Product } from "../../Pages/Home";

//icons
import CircleIcon from '@mui/icons-material/Circle';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import { GiConverseShoe } from 'react-icons/gi';
import { FaTshirt } from 'react-icons/fa';
import { GiShorts } from 'react-icons/gi';
import { GiMonclerJacket } from 'react-icons/gi';
import { GiLabCoat } from 'react-icons/gi';
import { GiDress } from 'react-icons/gi';
import { BsFillHandbagFill } from 'react-icons/bs';

interface CategoryStyle {
    icon: JSX.Element,
    category_name: string
}

export interface Filters {
    category: string
    color: string,
    season: string
}

interface MyProps {
    products: Product[],
}

export const NavigationBar: React.FC<MyProps> = ({ products }) => {

    //toggles the dialog
    const [open_dialog, setOpenDialog] = useState<boolean>(false);

    const dispatch = useDispatch();
    const { setFilterProducts, filterFilterProducts } = bindActionCreators(actionsCreators, dispatch);

    //all filters settings are held in this object
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
            icon: <GiConverseShoe className="category_icon" />,
            category_name: "shoes"
        },
        {
            icon: <FaTshirt className="category_icon" />,
            category_name: "shirts"
        },
        {
            icon: <GiShorts className="category_icon" />,
            category_name: "shorts"
        },
        {
            icon: <GiMonclerJacket className="category_icon" />,
            category_name: "jackets"
        },
        {
            icon: <GiLabCoat className="category_icon" />,
            category_name: "coats"
        },
        {
            icon: <GiDress className="category_icon" />,
            category_name: "dresses"
        },
        {
            icon: <BsFillHandbagFill className="category_icon" />,
            category_name: "bags"
        }
    ];

    //sort the categories array
    categories_array.sort((a, b) => {
        if (a.category_name < b.category_name)
            return -1;
        else if (a.category_name > b.category_name)
            return 1;
        else
            return 0;
    })

    //click handle for category filter change
    const handleCategoryChange = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setFilters((prev) => {
            if (prev.category === event.currentTarget.value as string)
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

    //click handle for color filter change
    const handleColorChange = (event: SelectChangeEvent) => {
        setFilters((prev) => {
            return {
                category: prev.category,
                color: event.target.value as string,
                season: prev.season
            }
        });
    }

    //click handle for season filter change
    const handleSeasonChange = (event: SelectChangeEvent) => {
        setFilters((prev) => {
            return {
                category: prev.category,
                color: prev.color,
                season: event.target.value as string
            }
        });
    }

    //filter when category is changed
    useEffect(() => {
        filterProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.category])

    //toggle the filter dialog
    const toggleDialog = () => {
        setOpenDialog((prev) => !prev);
    }

    //filter on click
    const handleFilterClick = () => {
        filterProducts();

        toggleDialog();
    }

    //disable all filters and return filtered_products to the original
    const disableFilters = () => {
        setFilters({
            category: "any_category",
            color: "any_color",
            season: "any_season"
        });

        setFilterProducts(products);
    }

    //filter the products array by the filters object,
    //and everytime a filter is changed, refilter the products 
    //array and place the filtered array in the filtered_array
    const filterProducts = () => {
        setFilterProducts(products)

        filterFilterProducts(filters)
    }

    return (
        <>
            <div className="navigation_bar">
                <div>
                    {categories_array.map((item, i) => {
                        return (
                            <Button key={i}
                                className="category_style"
                                value={item.category_name}
                                onClick={handleCategoryChange}
                                sx={{
                                    textTransform: "none", marginLeft: 3, fontFamily: "Rubik",
                                    color: item.category_name === filters.category ? "black" : "gray"
                                }}
                            >
                                {item.icon}
                                {item.category_name}
                            </Button>
                        )
                    })}
                </div>

                <div>
                    <button onClick={toggleDialog} className="filter_button">
                        {<FilterListIcon sx={{ fontSize: 17 }} />}Filters
                    </button>
                    <button onClick={disableFilters} className="filter_button">
                        {<FilterListOffIcon sx={{ fontSize: 17 }} />}Unfilter
                    </button>
                </div>
            </div>



            <Dialog open={open_dialog} onClose={toggleDialog}>
                <DialogTitle>
                    Filters
                </DialogTitle>

                <DialogContent>
                    <div>
                        <FormControl variant="standard" sx={{ width: 150, marginRight: 3 }}>
                            <InputLabel>Color</InputLabel>
                            <Select
                                id="color_select"
                                value={filters.color}
                                label="Color"
                                onChange={handleColorChange}
                            >
                                {
                                    colors_array.map((colorI, i) => {
                                        if (colorI === "any")
                                            return (
                                                <MenuItem key={i} value={"any_color"}>any</MenuItem>
                                            )
                                        else
                                            return (
                                                <MenuItem key={i} value={colorI}>{colorI}{<CircleIcon sx={{ marginLeft: "auto", color: colorI, marginBottom: -1 }} />}</MenuItem>
                                            )
                                    })
                                }
                            </Select>
                        </FormControl>

                        <FormControl variant="standard" sx={{ width: 120 }}>
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
                    <br />
                    <Button variant="contained"
                    onClick={handleFilterClick}
                    sx={{ textTransform: "none", fontWeight: "bold" }}>
                        Filter
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    )
}