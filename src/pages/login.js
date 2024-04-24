import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Nav from '../components/nav';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const warnRef = useRef(null);
  const loginBtnRef = useRef(null);
  const loadingRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setPassword(""); // Set password menjadi string kosong
    loginBtnRef.current.classList.add('d-none');
    loginBtnRef.current.classList.remove('d-block');
    loadingRef.current.classList.add('d-block');
    loadingRef.current.classList.remove('d-none');
    warnRef.current.classList.add('d-none');
  
    // Mengatur pesan kesalahan menjadi kosong saat pengguna mengirimkan formulir kembali
    document.getElementById('usernameerrors').innerHTML = "";
    document.getElementById('passworderrors').innerHTML = "";
  
    axios({
      method: "post",
      url: "http://localhost:8000/api/v1/auth/login",
      data: {
        username: username,
        password: password,
      }
    }).then((response) => {
      loginBtnRef.current.classList.add('d-block');
      loginBtnRef.current.classList.remove('d-none');
      loadingRef.current.classList.add('d-none');
      loadingRef.current.classList.remove('d-block');
      localStorage.setItem('token', response.data.token);
      return navigate('/');
    }).catch((error) => {
      loginBtnRef.current.classList.add('d-block');
      loginBtnRef.current.classList.remove('d-none');
      loadingRef.current.classList.add('d-none');
      loadingRef.current.classList.remove('d-block');
      warnRef.current.classList.remove('d-none');  
      warnRef.current.innerHTML = error.response.data.message;
      if (error.response.status === 401 || error.response.status === 422) {
        const errors = error.response.data.errors;
        if (Array.isArray(errors)) {
          errors.forEach(element => {
          });
        } else if (typeof errors === 'object') {
          for (const key in errors) {
            if (errors.hasOwnProperty(key)) {
              document.getElementById(key + 'errors').innerHTML = errors[key];
            }
          }
        }
      } else {
        warnRef.current.classList.remove('d-none');  
        warnRef.current.innerHTML = error.response.data;
      }
    });
  }
  


  return (
    <React.Fragment>
      <Nav />
      <main className="mt-5">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-5">
              <div className="card">
                <div className="card-header d-flex align-items-center justify-content-between bg-transparent py-3">
                  <h5 className="mb-0">Login</h5>
                </div>
                <div className="card-body">
                  <p className="alert alert-danger d-none" ref={warnRef}></p>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-2">
                      <label htmlFor="username">Username</label>
                      <p className="small m-0 p-0 text-danger" id="usernameerrors"></p>
                      <input
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        id="username"
                        name="username"
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="password">Password</label>
                      <p className="small m-0 p-0 text-danger" id="passworderrors"></p>
                      <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        id="password"
                        name="password"
                      />
                    </div>

                    <button type="submit" id="login-btn" className="btn btn-primary w-100" ref={loginBtnRef}>
                      Login
                    </button>
                    <center>
                      <div id="loading" className="loading d-none" ref={loadingRef}></div>
                    </center>
                  </form>
                </div>
              </div>

              <div className="text-center mt-4">
                Don't have account? <Link to={'../register'}>Register</Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </React.Fragment>
  );
}

export default Login;
