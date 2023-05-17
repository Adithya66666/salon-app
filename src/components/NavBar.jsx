import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./NavBar.css";
import { signOut } from "firebase/auth";
import { auth } from "./config/firebase";

function NavBar({isLoggedIn,userType}) {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);

  const logout = () => {
    sessionStorage.clear();
    signOut(auth);
    window.location.replace("Login");
  }
  
  return (
    <>
      <div>
				<ul className="nav">
					<li className="nav-item slam-left">
            <NavLink exact to="/" className="text-decoration-none text-light">
              Scissors
            </NavLink>
          </li>

          { !isLoggedIn && <>
            <li className="nav-item"><NavLink
                exact
                to="/login"
                activeClassName="active"
                onClick={handleClick}
              >
                Login
              </NavLink></li></> }
          
					
              { !isLoggedIn && <>
                <li className="nav-item"><NavLink
                exact
                to="/register"
                activeClassName="active"
                onClick={handleClick}
              >
                Register
              </NavLink></li>
              </> }
              


          { userType === "user" && <>
          
          { isLoggedIn && <>
            <li className="nav-item">
            <NavLink
                exact
                to="/"
                activeClassName="active"
                onClick={handleClick}
              >
                Home
              </NavLink>
          </li>
          </> }
              

              { isLoggedIn && <>
              <li className="nav-item"><NavLink
                exact
                to="/profile"
                activeClassName="active"
              >
                Profile
              </NavLink></li>
              </> }
          
          </> }


          { userType === "admin" && <>
          
          </>}


          { isLoggedIn && <>
                <li className="nav-item"><NavLink
                onClick={logout}
              >
                Logout
              </NavLink></li>
              </> }
				</ul>
			</div>
    </>
  );
}

export default NavBar;
