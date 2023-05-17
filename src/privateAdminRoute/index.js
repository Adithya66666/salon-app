import React from "react";
import { Navigate } from "react-router-dom";

const PrivateAdminRoute = ({children}) => {

    const userKey = sessionStorage.getItem('userkey');
    const usertype = sessionStorage.getItem('usertype');

    console.log(userKey);

    var userLoggedInStatus = false;
    if(userKey !== null && usertype === "admin"){
      userLoggedInStatus = true;
    }
    
    return userLoggedInStatus ? children : <Navigate to="/adminlogin"/>
};

export default PrivateAdminRoute;