import React from 'react';
import './App.css';

//components
import { Header } from './Components/Header/Header';
import { CatergoriesBar } from './Components/products/CategoriesBar';
import { ProductsGrid } from './Components/products/ProductsGrid';

function App() {
  return (
    <div className="app_container">
      <Header />
      <CatergoriesBar />
      <ProductsGrid />
    </div>
  );
}

export default App;
