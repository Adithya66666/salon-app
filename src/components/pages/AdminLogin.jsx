import React from "react";


import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { getDatabase, ref, child, get } from "firebase/database";

export const AdminLogin = () => {


  const handleLogin = async (e) => {
    e.preventDefault()
    const data = {
      email: e.target.email.value,
      password: e.target.password.value,
    }

    try{
      await signInWithEmailAndPassword(auth,data.email,data.password);
      
      const dbRef = ref(getDatabase());
      const snapshot = await get(child(dbRef, `Admin/${auth.currentUser.uid}`));
        if (snapshot.exists()) {
          sessionStorage.setItem('userkey',auth.currentUser.uid)
          sessionStorage.setItem('usertype',"admin");
          window.location.replace("/admin");
        } else {
          sessionStorage.clear();
          signOut(auth);
          window.location.replace("Login");
        }
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
        <h4 className="text-center">Admin Login</h4>
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
      </div>


      </div>

    </>
  );
};
