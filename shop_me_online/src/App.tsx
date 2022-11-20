import React, { useEffect, useState } from 'react';
import './App.css';

//redux
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionsCreators } from './state';

//components
import { Header } from './Components/Header/Header';
import { NavigationBar } from './Components/Header/NavigationBar';
import { ProductsGrid } from './Components/products/ProductsGrid';

export interface Product{
  id: string,
  name: string,
  price: number,
  quantity: number,
  categories: string,
  supplier_id?: string
}

export interface Cart{ //customer_product table
  product_id: string,
  address: string,
  amount: number,
  size: string,
  ordering_time: string,
  paid: boolean
}

function App() {

  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Air jordan 1 lucky green",
      price: 150,
      quantity: 150,
      categories: "#shoes#green"
    },
    {
      id: "2",
      name: "Air jordan travis scott",
      price: 300,
      quantity: 100,
      categories: "#shoes#black"
    }
  ]);

  const dispatch = useDispatch();
  const { resetFilterProducts } = bindActionCreators(actionsCreators, dispatch);

  useEffect(() => {
    resetFilterProducts(products);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  return (
    <div className="app_container">
      <Header />
      <NavigationBar 
      products={products} 
      />
      <ProductsGrid setProducts={setProducts} />
    </div>
  );
}

export default App;
