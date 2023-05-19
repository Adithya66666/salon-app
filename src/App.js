import { BrowserRouter as Router,  Route, Routes } from "react-router-dom";
import './App.css';

import NavBar from "./components/NavBar"

import { Home } from './components/pages/Home';
import { Login } from './components/pages/Login';
import { Register } from './components/pages/Register';
import { Footer } from "./components/pages/Footer";
import { ViewAppointment } from "./components/pages/ViewAppointment";
import { ViewService } from "./components/pages/ViewService";
import { Profile } from "./components/pages/Profile";
import { Seller } from "./components/pages/Seller";
import { Admin } from "./components/pages/Admin";
import { AdminLogin } from "./components/pages/AdminLogin";
import { SellerAppointments } from "./components/pages/SellerAppointments";

import PrivateRoute from "./privateRoute";
import PrivateAdminRoute from "./privateAdminRoute";

function App() {

  const userKey = sessionStorage.getItem('userkey');
  const userType = sessionStorage.getItem('usertype');

  var userLoggedInStatus = false;
  if(userKey !== null && userType !== null){
    userLoggedInStatus = true;
  }

  return (
    <>
      <Router>
        <NavBar 
        isLoggedIn={userLoggedInStatus}
        userType={userType}
        />

        <Routes>
          <Route path="/" element={<PrivateRoute><Home/></PrivateRoute>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/viewAppointment/:salonId" element={<PrivateRoute><ViewAppointment/></PrivateRoute>}/>
          <Route path="/viewService/:serviceId" element={<PrivateRoute><ViewService/></PrivateRoute>}/>
          <Route path="/profile" element={<PrivateRoute><Profile/></PrivateRoute>}/>
          <Route path="/seller" element={<PrivateRoute><Seller/></PrivateRoute>}/>
          <Route path="/admin" element={<PrivateAdminRoute><Admin/></PrivateAdminRoute>}/>
          <Route path="/adminlogin" element={<AdminLogin/>}/>
          <Route path="/seller/appointments" element={<SellerAppointments/>}/>
        </Routes>
      </Router>

      <Footer/>

    </>
  );
}

export default App;
