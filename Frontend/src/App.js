import './App.css';
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserContext, UserContextProvider } from './Components/userContext'
import Login from './Components/Login';
import Signin from './Components/Signin';
import Homepage from './Components/Homepage';
import Trash from './Components/Trash'

function App() {
  return (
    // <ThemeProvider theme={theme}>
      <UserContextProvider> {/* Wrap the Router with UserContextProvider */}
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signin />} />
            <Route path="/" element={<Homepage />} />
            <Route path="/trash" element={<Trash />} />
          </Routes>
        </Router>
      </UserContextProvider>
    // </ThemeProvider>
  );
}

export default App;
