import React, { useEffect, useState } from 'react';
//import './App.css';

//Apollo and graphql
import { useQuery } from "@apollo/client"
import { GET_ALL_PRODUCTS } from "../Queries/Queries";

//redux
import { useDispatch } from 'react-redux';
import { actionsCreators } from "../state";
import { bindActionCreators } from 'redux';

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
  paid: boolean
}

function Home() {

  const [products, setProducts] = useState<Product[]>([]);

  const { data: products_data } = useQuery(GET_ALL_PRODUCTS);
  
  const dispatch = useDispatch();
  const { resetFilterProducts } = bindActionCreators(actionsCreators, dispatch);

  useEffect(() => {
    if(products_data)
    {
      setProducts(products_data.getAllProducts);
      resetFilterProducts(products_data.getAllProducts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products_data]);

  return (
    <div className="home_container">
      <Header />
      <NavigationBar
        products={products}
      />
      <ProductsGrid products={products} setProducts={setProducts} />
    </div>
  );
}

export default Home;
