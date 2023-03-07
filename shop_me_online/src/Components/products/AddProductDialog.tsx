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

interface SavedImage {
    image_location: string,
    name: string
}

interface MyFormValues {
    name: string,
    price: number,
    quantity: number,
    product_image: string
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
    const [image, setImage] = useState<SavedImage>({image_location: "", name: ""});
    const [err_text, setErrText] = useState<string>("");
    
    //redux actions
    const dispatch = useDispatch();
    const { addToProducts } = bindActionCreators(actionsCreators, dispatch);

    //mutations
    const [addProductToProducts] = useMutation(ADD_PRODUCT_TO_PRODUCTS);
    
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
        quantity: 0,
        product_image: ""
    };

    //the validation schema 
    const validation_schema: any = Yup.object().shape({
        name: Yup.string().required("Required"),
        price: Yup.number().min(0, "Must be bigger than 0").required("Required"),
        quantity: Yup.number().min(0, "Must be bigger than 0").required("Required")
    });

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.files === null) {
            setErrText("choose an image");
            return;
        }
        
        if(event.target.files === undefined) {
            setErrText("choose an image");
            return;
        }

        //displays the image on the side
        const file_ref = event.target.files[0];
        const file_type: string= file_ref.type || "";
        const reader = new FileReader();
        reader.readAsBinaryString(file_ref)
        reader.onload=(ev: any) => {
            // convert it to base64
            setImage({
                image_location: `data:${file_type};base64,${btoa(ev.target.result)}`,
                name: file_ref.name
            });
        };
    }

    const onSubmit = async(values: MyFormValues) => {
        if(category_array.length === 0) { //if no categories has been chosen
            setErrText("select categories");
            return;
        }

        if(values.name !== image.name.split('.')[0]) {
            setErrText("image name and product name needs to be the same");
            return;
        }

        const full_category: string = formatCategories();

        //the key that is needed to get the image from s3
        const img_location = image.name;

        //update the db
        addProductToProducts({
            variables: {
                name: values.name,
                price: values.price,
                quantity: values.quantity,
                category: full_category,
                img_location: img_location
            }
        }).then((res) => {
            //create the new product
            const product: Product = {
                id: res.data.addProductToProducts.id,
                name: res.data.addProductToProducts.name,
                price: res.data.addProductToProducts.price,
                quantity: res.data.addProductToProducts.quantity,
                category: res.data.addProductToProducts.category,
                img_location: res.data.addProductToProducts.img_location,
                img_uploaded: res.data.addProductToProducts.img_uploaded
            }

            //add the product to the products after the mutation succeeds
            addToProducts(product);
        });

        closeDialog();
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

        //clear the image
        setImage({image_location: "", name: ""});

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
                    <div className="image_selection">
                        <img src={image.image_location} alt={"procducts img"} className="buying_img" />
                        <input type="file" name="file" onChange={handleImageChange} accept="image/png, image/jpg" />
                        <p>*image will not be saved. to save the image upload it in aws s3, in the link:</p>
                        <a target="_blank" 
                        href="https://s3.console.aws.amazon.com/s3/upload/shop-me-online-bucket?region=eu-central-1"
                        >
                            here
                        </a>
                    </div>
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
                        Add
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