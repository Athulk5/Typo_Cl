import { useState } from 'react'
import Navbar from './Components/navbar'
import HomePage from './Pages/HomePage'
import Signlogin from './Pages/Sign-login';
import Login from './Pages/login';
import Leaderboard from "./Pages/LeaderBoard";
import AccountDetails from './Pages/AccountDetails';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {

  return (
    <>
   
    <Router>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-login" element={<Signlogin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/account-details" element={<AccountDetails />} />

      </Routes>
    </Router>
   
    </>
  )
}

export default App
