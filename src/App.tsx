import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import About from './pages/About';
import Candidate from './pages/Candidate';
import Company from './pages/Company';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Header from './components/Header';
import CompanyDashboard from './pages/CompanyDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CandidateDashboard from './pages/CandidateDashboard';
import Signup from './pages/Signup';
import CompanyDetails from './Company/CompanyDetails';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/CompanyDashboard" element={<CompanyDashboard />} />
         <Route path="/AdminDashboard" element={<AdminDashboard />} />
         <Route path="/CandidateDashboard"element={<CandidateDashboard/>}/>
         <Route path="/Company/CompanyDetails"element={<CompanyDetails/>}/>
         <Route path="/about" element={<About />} />
        <Route path="/candidate" element={<Candidate />} />
        <Route path="/company" element={<Company />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Signup" element={<Signup/>}/>
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;