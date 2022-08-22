import React from 'react';
import './App.css';
import { Footer } from './Components/Footer/Footer';
import { Header } from './Components/Header/Header';
import { MainContent } from './Components/MainContent';


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
