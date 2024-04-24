import "./App.css";
import "./bootstrap.css";
import "./style.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Login from './pages/login';
import Register from './pages/register';
import Home from "./home";
import NotFound from './pages/404';
import axios from "axios";

const AuthGuest = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [navigate, token]);

  return children;
}

const RequireAuth = ({ children }) => {
  const [authStatus, setAuthStatus] = useState('pending');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAuthStatus('unauthorized');
    } else {
      const authorizationHeader = axios.create({
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      authorizationHeader.post('http://localhost:8000/api/v1/auth/token')
        .then((response) => {
          setAuthStatus('authorized');
        })
        .catch((error) => {
          setAuthStatus('unauthorized');
        });
    }
  }, []);

  if (authStatus === 'pending') { 
    return <div className="d-flex justify-content-center align-items-center h-100 1-100 flex-column"><div id="loading"  className="loading"></div>Mengauthentikasi...</div>;
  } else if (authStatus === 'unauthorized') {
    navigate('/login');
    // return <div>TES</div>;
  } else {
    return children;
  }
};
const Logout = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.removeItem('token');
    navigate('/login')
   })
};
const App = () => {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/login" element={<AuthGuest><Login /></AuthGuest>} />
          <Route path="/register" element={<AuthGuest><Register /></AuthGuest>} />
          <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
          <Route path="/*" element={<NotFound />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
