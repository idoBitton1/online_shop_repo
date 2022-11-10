import React from 'react';
import './App.css';

//components
import { Header } from './Components/Header/Header';
import { ProductsGrid } from './Components/products/ProductsGrid';

function App() {
  return (
    <div className="app_container">
      <Header />
      <ProductsGrid />
    </div>
  );
}

export default App;
