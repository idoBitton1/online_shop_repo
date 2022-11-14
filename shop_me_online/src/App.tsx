import React, { useEffect, useState } from 'react';
import './App.css';

//components
import { Header } from './Components/Header/Header';
import { NavigationBar } from './Components/Header/NavigationBar';
import { ProductsGrid } from './Components/products/ProductsGrid';

export interface Product{
  id: string,
  name: string,
  price: number,
  quantity: number,
  categories: string
}

function App() {

  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "air jordan 1 lucky green",
      price: 150,
      quantity: 150,
      categories: "#shoes#green"
    },
    {
      id: "2",
      name: "air jordan travis scott",
      price: 300,
      quantity: 100,
      categories: "#shoes#black"
    }
  ]);

  const [filtered_products, setFilteredProducts] = useState<Product[]>(products);

  return (
    <div className="app_container">
      <Header />
      <NavigationBar products={products} filtered_products={filtered_products} setFilteredProducts={setFilteredProducts} />
      <ProductsGrid products={products} filtered_products={filtered_products} />
    </div>
  );
}

export default App;
