import React, { useEffect, useState } from 'react';
//import './App.css';

//Apollo and graphql
import { useQuery } from "@apollo/client"
import { GET_ALL_PRODUCTS } from "../Queries/Queries";

//redux
import { useDispatch } from 'react-redux';
import { actionsCreators } from "../state";
import { bindActionCreators } from 'redux';
import { useSelector } from 'react-redux';
import { ReduxState } from "../state";

//components
import { Header } from '../Components/Header/Header';
import { NavigationBar } from '../Components/Header/NavigationBar';
import { ProductsGrid } from '../Components/products/ProductsGrid';

export interface Product {
  id: string,
  name: string,
  price: number,
  quantity: number,
  category: string,
  img_location: string
}

export interface CartProduct { //users_products table
  user_id: string,
  product_id: string,
  address: string,
  amount: number,
  size: string,
  ordering_time: string,
  paid: boolean,
  transaction_id: string
}

function Home() {

  const products = useSelector((redux_state: ReduxState) => redux_state.products);

  const { data: products_data } = useQuery(GET_ALL_PRODUCTS);
  
  const dispatch = useDispatch();
  const { setFilterProducts, setProducts, dont_fetch_products } = bindActionCreators(actionsCreators, dispatch);

  useEffect(() => {
    if(products_data && products.fetch_info) {
      dont_fetch_products();
      setProducts(products_data.getAllProducts);
      setFilterProducts(products_data.getAllProducts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products_data]);

  return (
    <div className="home_container">
      <Header />
      <NavigationBar
        products={products.products}
      />
      <ProductsGrid />
    </div>
  );
}

export default Home;
