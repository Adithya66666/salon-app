import React from "react";
import './Home.css';
import './Css/Login.css';

import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";

export const Login = () => {

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault()
    const data = {
      email: e.target.email.value,
      password: e.target.password.value,
    }

    try{
      await signInWithEmailAndPassword(auth,data.email,data.password);
      //alert(auth.currentUser.uid)
      sessionStorage.setItem('userkey',auth.currentUser.uid)
      sessionStorage.setItem('usertype',"user");
      window.location.replace("/");
    }catch(err){
      alert(err.code);
    }
  }

  return (
    <>
    <div className="mainContainer">


    <div className="container">
      <img src="scissors.png" alt="Logo" className="logo" />
      <h1 className="text-center">Scissors</h1>
      <h4 className="text-center">Login</h4>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit" className="btn_main">Login</button>
      </form>
      <p>
        Don't have an account? <a href="register.html">Register</a>
      </p>
    </div>


    </div>
    </>
  );
};
