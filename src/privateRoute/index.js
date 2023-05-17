import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({children}) => {

    const userKey = sessionStorage.getItem('userkey');
    const usertype = sessionStorage.getItem('usertype');

    console.log(userKey);

    var userLoggedInStatus = false;
    if(userKey !== null && usertype === "user"){
      userLoggedInStatus = true;
    }
    
    return userLoggedInStatus ? children : <Navigate to="/login"/>
};

export default PrivateRoute;