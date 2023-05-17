import React from "react";
import './Home.css';
import './Css/Login.css';
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { getDatabase, ref, push, set,get,child, remove } from "firebase/database";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";

export const Register = () => {

  const dbRef = ref(getDatabase());
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    
    e.preventDefault()
    const data = {
      fname: e.target.firstName.value,
      lname: e.target.lastName.value,
      username: e.target.username.value,
      email: e.target.email.value,
      password: e.target.password.value,
      cpassword: e.target.confirmPassword.value,
      phone: e.target.phoneNumber.value,
    }

    if(data.password === data.cpassword){
      try{
        await createUserWithEmailAndPassword(auth,data.email,data.password);

        const db = getDatabase();
        const dataRef = ref(db, `User/${auth.currentUser.uid}`);

        await set(dataRef, data)
        .then(() => {
            sessionStorage.setItem('userkey',auth.currentUser.uid)
            sessionStorage.setItem('usertype',"user");
            window.location.replace("/");
        })
        .catch((error) => {
          signOut(auth)
          alert("error")
        });
        
      }catch(err){
        alert(err.code)
      }
    }else{
      alert("Passwords are not matched")
    }
  }

  return (
    <>
  <div className="mainContainer">

  <div className="container">
      <img src="scissors.png" alt="Logo" className="logo" />
      <h1 className="text-center">Scissors</h1>
      <h4 className="text-center">Register</h4>
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input type="text" id="firstName" name="firstName" required />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input type="text" id="lastName" name="lastName" required />
        </div>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input type="tel" id="phoneNumber" name="phoneNumber" required />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">Confirm Password:</label>
          <input type="password" id="confirmPassword" name="confirmPassword" required />
        </div>
        <button type="submit" className="btn_main">Register</button>
      </form>
      <p>
        Already have an account? <a href="login.html">Login</a>
      </p>
    </div>
    
  </div>

    </>
  );
};
