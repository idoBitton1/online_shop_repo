import React, { useState } from "react";
import "./Products.css";

//form
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

//Apollo and graphql
import { useMutation } from "@apollo/client";
import { ADD_PRODUCT_TO_PRODUCTS } from "../../Queries/Mutations";

//redux
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionsCreators } from '../../state';

//material ui
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from "@mui/material/Typography";
import { Button, Checkbox, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, SelectChangeEvent, TextField } from "@mui/material";

//interfaces
import { Product } from "../../Pages/Home";

//images
import img from "../../Images/j1.png";

interface MyProps {
    is_open: boolean,
    toggleDialog: () => void
}

interface MyFormValues {
    name: string,
    price: number,
    quantity: number
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

const categories: string[] = [
    "shoes",
    "shirts",
    "shorts",
    "jackets",
    "coats",
    "dresses",
    "bags",
    "black",
    "blue",
    "green",
    "spring",
    "summer",
    "autumn",
    "winter"
];

export const AddProductDialog: React.FC<MyProps> = ({is_open, toggleDialog}) => {
    //states
    const [category_array, setCategoryArray] = useState<string[]>([]);
    const [err_text, setErrText] = useState<string>("");

    //redux actions
    const dispatch = useDispatch();
    const { addToProducts } = bindActionCreators(actionsCreators, dispatch);

    //mutations
    const [addProductToProducts] = useMutation(ADD_PRODUCT_TO_PRODUCTS, {
        onCompleted(data) {
            const product: Product = {
                id: data.addProductToProducts.id,
                name: data.addProductToProducts.name,
                price: data.addProductToProducts.price,
                quantity: data.addProductToProducts.quantity,
                category: data.addProductToProducts.category,
                img_location: data.addProductToProducts.img_location
            }

            //add the product to the products after the mutation succeeds
            addToProducts(product);
        },
    });
    
    const handleChange = (event: SelectChangeEvent<typeof category_array>) => {
        const { target: { value } } = event;

        setCategoryArray(
          // On autofill we get a stringified value.
          typeof value === "string" ? value.split(",") : value
        );
    };

    //the initial values of the form
    const initial_values: MyFormValues = {
        name: "",
        price: 0,
        quantity: 0
    };

    //the validation schema 
    const validation_schema: any = Yup.object().shape({
        name: Yup.string().required("Required"),
        price: Yup.number().min(0, "Must be bigger than 0").required("Required"),
        quantity: Yup.number().min(0, "Must be bigger than 0").required("Required")
    });

    const onSubmit = (values: MyFormValues) => {
        if(category_array.length === 0) { //if no categories has been chosen
            setErrText("select categories");
            return;
        }

        const full_category: string = formatCategories();

        const img_location: string = "";

        //update the db
        addProductToProducts({
            variables: {
                name: values.name,
                price: values.price,
                quantity: values.quantity,
                category: full_category,
                img_location: img_location
            }
        });
    }

    const formatCategories = (): string => {
        let full_category: string = "";

        for(let i=0; i < category_array.length; i++)
            full_category += `#${category_array[i]}`;
        
        return full_category.slice(1);
    }

    const closeDialog = () => {
        //clear the categories array
        setCategoryArray([]);

        //clear the error text
        setErrText("");

        //close the dialog
        toggleDialog();
    }

    return(
        <Dialog open={is_open} onClose={closeDialog} fullWidth>
            <DialogTitle>
                <Typography
                    fontSize={25}
                    borderBottom={1}
                    borderColor={"lightgray"}
                    gutterBottom>
                    Add product
                </Typography>
            </DialogTitle>

            <DialogContent>
                <div className="add_product_contex">
                    <img src={img} alt={"procducts img"} className="buying_img" />
                    <div className="buying_info">
                    <Formik 
                    initialValues={initial_values}
                    validationSchema={validation_schema}
                    onSubmit={onSubmit}
                    >
                    {(props) => (
                    <Form>
                        <Field as={TextField} name="name"
                        label="name"
                        variant="outlined"
                        value={props.values.name}
                        onChange={props.handleChange}
                        margin="normal"
                        helperText={<ErrorMessage name="name" />}
                        />

                        <Field as={TextField} name="price"
                        label="price"
                        variant="outlined"
                        type="number"
                        value={props.values.price}
                        onChange={props.handleChange}
                        margin="normal"
                        helperText={<ErrorMessage name="price" />}
                        />

                        <Field as={TextField} name="quantity"
                        label="quantity"
                        variant="outlined"
                        type="number"
                        value={props.values.quantity}
                        onChange={props.handleChange}
                        margin="normal"
                        helperText={<ErrorMessage name="quantity" />}
                        />

                        <FormControl sx={{ marginTop: 2, width: 225 }}>
                        <InputLabel>categories</InputLabel>
                        <Select
                        id="multiple_checkbox"
                        multiple
                        value={category_array}
                        onChange={handleChange}
                        input={<OutlinedInput label="categories" />}
                        renderValue={(selected) => selected.join(", ")}
                        MenuProps={MenuProps}
                        >
                        {categories.map((name) => (
                            <MenuItem key={name} value={name}>
                            <Checkbox checked={category_array.indexOf(name) > -1} />
                            <ListItemText primary={name} />
                            </MenuItem>
                        ))}
                        </Select>
                        </FormControl>

                        <Button type="submit"
                        color="primary"
                        variant="contained"
                        fullWidth
                        sx={{ textTransform: "none", fontWeight: "bold", marginTop: 1 }}
                        >
                        Update
                        </Button>
                        <p className="error_text">{err_text ? err_text : ""}</p>
                    </Form>
                    )}
                    </Formik>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}