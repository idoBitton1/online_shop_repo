import React, { useState } from "react";
import "./Products.css"

//material ui
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, FormControl, InputLabel, MenuItem, Select, Typography,
         ThemeProvider, createTheme} from "@mui/material";

//interface
import {Product as MyProps} from "../../App"

//icons
import FavoriteIcon from '@mui/icons-material/Favorite';

//images
import img from "../../Images/j1.png"

export const ProductDisplay: React.FC<MyProps> = ({id, name, price, quantity, categories}) => {

    const [size, setSize] = useState<string>("");
    const [open_dialog, setOpenDialog] = useState<boolean>(false);

    const toggleDialog = () => {
        setOpenDialog((prev) => !prev);
    }

    //theme
    const theme = createTheme({
        palette: {
            primary: {
                main: '#000000'
            }
        }
    })

    return(
        <>
        <ThemeProvider theme={theme}>
        <div className="Product_container" onClick={toggleDialog}>
            <img src={img} alt={name} className="img product_img" />
            <div className="product_details">
                <p className="product_name">{name}</p>
                <p className="product_quantity">Left: {quantity}</p>
            </div>
            <p className="product_price">{price}$</p>
        </div>

        <Dialog open={open_dialog} onClose={toggleDialog} fullWidth>
            <DialogTitle>
                <Typography
                fontSize={25}
                borderBottom={1}
                borderColor={"lightgray"}
                gutterBottom>
                    {name}
                </Typography>
            </DialogTitle>

            <DialogContent>
                <div className="buying_container">
                    <img src={img} alt={name} className="buying_img" />
                    <div className="buying_info">
                        <p>Left: {quantity}</p>

                        <p>${price}</p>

                        {!categories.includes("bags") ? 
                        <FormControl variant="standard" sx={{marginBottom: 2}}>
                            <InputLabel>Size</InputLabel>
                            <Select
                            id="size_select"
                            label="size"
                            value={size}
                            onChange={(event) => setSize(event.target.value as string)}
                            >
                            <MenuItem value={categories.includes("shoes") ? "41" : "XS"}>{categories.includes("shoes") ? "41" : "XS"}</MenuItem>
                            <MenuItem value={categories.includes("shoes") ? "42" : "S"}>{categories.includes("shoes") ? "42" : "S"}</MenuItem>
                            <MenuItem value={categories.includes("shoes") ? "43" : "M"}>{categories.includes("shoes") ? "43" : "M"}</MenuItem>
                            <MenuItem value={categories.includes("shoes") ? "44" : "L"}>{categories.includes("shoes") ? "44" : "L"}</MenuItem>
                            <MenuItem value={categories.includes("shoes") ? "45" : "XL"}>{categories.includes("shoes") ? "45" : "XL"}</MenuItem>
                            </Select>
                        </FormControl>
                        :
                        <></>}

                        <div style={{display: "flex"}}>
                            <Button variant="contained" 
                            sx={{textTransform: "none", marginRight: 1, fontWeight: "bold"}}>
                                Add To Cart
                            </Button>
                            <Button variant="outlined" endIcon={<FavoriteIcon />}
                            sx={{textTransform: "none", fontWeight: "bold"}}>
                                Wishlist
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
        </ThemeProvider>
        </>
    )
}