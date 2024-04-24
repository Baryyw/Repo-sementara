import React, { SyntheticEvent, useState } from "react";
import Nav from "../components/nav";
import { BrowserRouter, Route, Routes, Navigate, useNavigate, Link } from "react-router-dom";
import axios from "axios";
const Register = () => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [is_private, setStatus] = useState(false);
  const navigate = useNavigate();
  let element = ['full_name', 'username', 'password', 'bio']
  let onRequest = 0;
  let cd = 3;
  let warn = document.getElementById('alert')
  const handleSubmit = (e) => {
    e.preventDefault();
    onRequest += 1;
    const privateValue = is_private ? 1 : 0;
    document.getElementById('loading').classList.remove('d-none')
    document.getElementById('btn-submit').classList.add('d-none')
    if(onRequest == 1){
        axios({
            method: "post",
            url: "http://localhost:8000/api/v1/auth/register",
            data: {
              full_name: fullName,
              username: username,
              password: password,
              bio: bio,
              is_private: privateValue
            }
          }).then(function (response) {
            onRequest = 0;
            warn.innerHTML = response.data.message + `, You will Be Redirected in ${cd}`
            localStorage.setItem('token', response.data.token)
            warn.classList.add('alert-success')
            warn.classList.remove('alert-danger', 'd-none')
            document.getElementById('loading').classList.add('d-none')
            setInterval(() => {
              cd = cd - 1
              warn.innerHTML = response.data.message + `, You will Be Redirected in ${cd}`
              if(cd == 0){
                navigate('/')
              }
            }, 1000)
            for(let i = 0; i <= 3; i++) {
                document.getElementById(element[i] + 'errors').innerHTML = '';
            }
        }).catch(function (error) {
            onRequest = 0;
            if (error.response) {
                document.getElementById('loading').classList.add('d-none')
                document.getElementById('btn-submit').classList.remove('d-none')
                if (error.response.status === 401 || error.response.status === 422) {
                  const errors = error.response.data.errors;
                  if (Array.isArray(errors)) {
                    errors.forEach(element => {
                      console.log(element);
                    });
                  } else if (typeof errors === 'object') {
                    for(let i = 0; i <= 3; i++){
                        document.getElementById(element[i] + 'errors').innerHTML = '';
                    }
                    for (const key in errors) {
                      if (errors.hasOwnProperty(key)) {
                        document.getElementById(key + 'errors').innerHTML = errors[key];
                      }
                    }
                  }
                } else {
                  warn.classList.remove('d-none')  
                  warn.innerHTML = error.response.data;
                }
              } else if (error.request) {
                warn.classList.remove('d-none')  
                warn.innerHTML = error.request;
            } else {
                  warn.classList.remove('d-none')  
                warn.innerHTML = error.message;
              }
          });
          
    }
  };
  return (
    <React.Fragment>
      <Nav />
      <main className="mt-5">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-5">
              <div className="card">
                <div className="card-header d-flex align-items-center justify-content-between bg-transparent py-3">
                  <h5 className="mb-0">Register</h5>
                </div>
                <div className="card-body">
                    <p className="alert alert-danger d-none" id="alert"></p>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-2">
                      <label htmlFor="full_name">Full Name</label>
                      <p className="small m-0 p-0 text-danger" id="full_nameerrors"></p>
                      <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="form-control" id="full_name" name="full_name" />
                    </div>

                    <div className="mb-2">
                      <label htmlFor="username">Username</label>
                      <p className="small m-0 p-0 text-danger" id="usernameerrors"></p>
                      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="form-control" id="username" name="username" />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="password">Password</label>
                      <p className="small m-0 p-0 text-danger" id="passworderrors"></p>
                      <input type="password" onChange={(e) => setPassword(e.target.value)} className="form-control" id="password" name="password" />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="bio">Bio</label>
                      <p className="small m-0 p-0 text-danger" id="bioerrors"></p>
                      <textarea name="bio" defaultValue={bio} id="bio" cols="30" rows="3" className="form-control" onChange={(e) => setBio(e.target.value)}></textarea>
                    </div>

                    <div className="mb-3 d-flex align-items-center gap-2">
                      <input checked={is_private} onChange={() => setStatus(!is_private)} type="checkbox" id="is_private" name="is_private"/>
                      <label htmlFor="is_private">Private Account</label>
                    </div>

                    <button type="submit" id="btn-submit" className="btn btn-primary w-100">Register</button>
                    <div className="d-flex w-100 justify-content-center">

                    <div id="loading"  className="loading d-none"></div>
                    </div>
                  </form>
                </div>
              </div>

              <div className="text-center mt-4">
                Already have an account? <Link to={"../login"}>Login</Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </React.Fragment>
  );
};

export default Register;
