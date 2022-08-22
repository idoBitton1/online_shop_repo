import React, { useState } from 'react';
import './App.css';
import { Header } from './Components/Header/Header';
import { MainContent } from './Components/MainContent';
import { Footer } from './Components/Footer';

function App() {

  return (

    <div className="app_container">

      <Header />
      <MainContent />
      <Footer />
    </div>
  );
}

export default App;
