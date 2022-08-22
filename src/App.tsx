import React from 'react';
import './App.css';
import { Footer } from './Components/Footer/Footer';
import { MainContent } from './Components/MainContent/MainContent';
import { Header } from './Components/Header/Header';



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
