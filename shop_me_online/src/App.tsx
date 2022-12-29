import React from 'react';
import './App.css';

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

//Material-ui
import { ThemeProvider, createTheme } from "@mui/material"

//Pages
import Home from './Pages/Home';
import Register from './Pages/Register';
import LogIn from './Pages/LogIn';
import Cart from './Pages/Cart';
import Wishlist from './Pages/Wishlist';

function App() {

  //theme
  const theme = createTheme({
    palette: {
      primary: {
        main: '#000000'
      }
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <div className="app_container">
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register is_manager={false} />} />
            <Route path="/registerManager" element={<Register is_manager={true} />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="wishlist" element={<Wishlist />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
