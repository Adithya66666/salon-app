import React from "react";
import './Footer.css';
import { useState,useEffect } from "react";
import { auth } from "../config/firebase";
import { getDatabase, ref, child, get, set,remove } from "firebase/database";
import emailjs, { send } from 'emailjs-com';

export const Profile = (e) => {

    const [userEmail,setUserEmail] = useState("")
    const [userFname,setuserFname] = useState("")
    const [userLname,setUserLName] = useState("")
    const [userPhone,setUserPhone] = useState("")
    const [userUserName,setUserUsername] = useState("")

    const [viewUpdate,setViewUpdate] = useState(false)

    //database
    const dbRef = ref(getDatabase());

    const getData = async () => {
      const userId = auth.currentUser.uid

      const snapshot = await get(child(dbRef, `User/${userId}`));
        if (snapshot.exists()) {
            setUserEmail(snapshot.child("email").val())
            setuserFname(snapshot.child("fname").val())
            setUserLName(snapshot.child("lname").val())
            setUserPhone(snapshot.child("phone").val())
            setUserUsername(snapshot.child("username").val())
        } else {
          console.log("No data available");
        }

    }

    const handlePersonalChange = async (e) => {

      e.preventDefault()
      const data = {
        fname: e.target.firstName.value,
        lname: e.target.lastName.value,
        username: e.target.username.value,
        phone: e.target.phone.value,
      }

      const db = getDatabase();
      const dataRef_fname = ref(db, `User/${auth.currentUser.uid}/fname`);
      const dataRef_lname = ref(db, `User/${auth.currentUser.uid}/lname`);
      const dataRef_username = ref(db, `User/${auth.currentUser.uid}/username`);
      const dataRef_phone = ref(db, `User/${auth.currentUser.uid}/phone`);

      await set(dataRef_fname, userFname)
      .then(() => {
        
      })
      .catch((error) => {
        alert("User not updated. Error occurred!");
      });
      await set(dataRef_lname, userLname)
      .then(() => {
        
      })
      .catch((error) => {
        alert("User not updated. Error occurred!");
      });
      await set(dataRef_username, userUserName)
      .then(() => {
        
      })
      .catch((error) => {
        alert("User not updated. Error occurred!");
      });
      await set(dataRef_phone, userPhone)
      .then(() => {
        
      })
      .catch((error) => {
        alert("User not updated. Error occurred!");
      });

      setViewUpdate(false);
    }

    useEffect(() => {
      // Function to be called on page load
      getData();
    }, []); // Empty dependency array
  
    const [cardsUpComing, setCardsUpComing] = useState([]);
    const [cardsCompleted, setCardsCompleted] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentView, setCurrentView] = useState("Upcoming Appointments");


    const getDataUpComing = async () => {
      setLoading(true);
      setCurrentView("Upcoming Appointments")
      const dbRef = ref(getDatabase());
      const snapshot = await get(child(dbRef, `Appointment`));
        if (snapshot.exists()) {
          const tempCards = [];
          snapshot.forEach((childSnapshot) => {
            if(childSnapshot.child("userid").val() === auth.currentUser.uid && 
            childSnapshot.child("status").val() === "pending"){
    
              const data = {
                userid: childSnapshot.child("userid").val(),
                sellerId: childSnapshot.child("sellerId").val(),
                appointmentId: childSnapshot.child("appointmentId").val(),
                year: childSnapshot.child("year").val(),
                month: childSnapshot.child("month").val(),
                date: childSnapshot.child("date").val(),
                time: childSnapshot.child("time").val(),
                paymentMethod: childSnapshot.child("paymentMethod").val(),
                serviceId: childSnapshot.child("serviceId").val(),
                createdDate: childSnapshot.child("createdDate").val(),
                status: childSnapshot.child("status").val(),
                cName:childSnapshot.child("cName").val(),
                businessName:childSnapshot.child("businessName").val(),
                serviceName:childSnapshot.child("serviceName").val(),
              };
              tempCards.push(data);
            }
          })
    
          setCardsUpComing(tempCards);
          setLoading(false);
    
        } else {
    
        }
    }
  
    
      const getDataCompleted = async () => {
        setLoading(true);
        setCurrentView("Completed Appointments")
        const dbRef = ref(getDatabase());
        const snapshot = await get(child(dbRef, `Appointment`));
          if (snapshot.exists()) {
            const tempCards = [];
            snapshot.forEach((childSnapshot) => {
              if(childSnapshot.child("userid").val() === auth.currentUser.uid && 
              childSnapshot.child("status").val() === "completed"){
                
                const data = {
                  userid: childSnapshot.child("userid").val(),
                  sellerId: childSnapshot.child("sellerId").val(),
                  appointmentId: childSnapshot.child("appointmentId").val(),
                  year: childSnapshot.child("year").val(),
                  month: childSnapshot.child("month").val(),
                  date: childSnapshot.child("date").val(),
                  time: childSnapshot.child("time").val(),
                  paymentMethod: childSnapshot.child("paymentMethod").val(),
                  serviceId: childSnapshot.child("serviceId").val(),
                  createdDate: childSnapshot.child("createdDate").val(),
                  status: childSnapshot.child("status").val(),
                  cName:childSnapshot.child("cName").val(),
                  businessName:childSnapshot.child("businessName").val(),
                  serviceName:childSnapshot.child("serviceName").val(),
                };
                tempCards.push(data);
              }
            })
      
            setCardsCompleted(tempCards);
            setLoading(false);
      
          } else {
      
          }
      }

      useEffect(() => {
        getData();
        getDataUpComing();
        getDataCompleted();

      }, []);
    
      const deleteAppointment = async (id) => {
        const db = getDatabase();
        const serviceRef = ref(db, `Appointment/${id}`);
      
        try {
          await remove(serviceRef);
          console.log('Appointment deleted successfully');
          getDataUpComing()
          // Perform any additional actions after deleting the service
        } catch (error) {
          console.error('Failed to delete Appointment:', error);
          // Handle the error accordingly
        }
      }

  return (
    <>
    <div className="main">
        <div className="contentContainer">
          {!viewUpdate && <>
            <div className="border-bottom mb-4 topViewBar">
                
                <div className="imgViewBar">
                    <img src="../user.png" alt="" />
                </div>
                <div>
                    <h1>{ userFname } { userLname }</h1>
                    <h6>{userEmail}</h6>
                    <h6>{userUserName}</h6>
                    <h6>{ userPhone }</h6>
                    <button className="small_main_btn" onClick={() => setViewUpdate(true)}>Edit Personal Details</button>
                    <button className="small_main_btn">Logout</button>
                </div>
            </div>
          </>}
            
            { viewUpdate && <>
              <div className="border-bottom mb-4 topViewBar">
                
                <div className="imgViewBar">
                    <img src="../user.png" alt="" />
                </div>
                <div>
                    <form onSubmit={handlePersonalChange}>
                    <h1>Edit Personal Details</h1>
                    <h6>First Name</h6>
                    <input type="text" placeholder="Enter the new First name" value={userFname} name="firstName" id="firstName" className="mb-2" onChange={(e) => setuserFname(e.target.value)} required/>
                    <h6>Last Name</h6>
                    <input type="text" placeholder="Enter the new Last name" value={userLname} name="lastName" id="lastName" className="mb-2" onChange={(e) => setUserLName(e.target.value)} required/>
                    <h6>Username</h6>
                    <input type="text" placeholder="Enter the new Username" value={userUserName} name="username" id="username" className="mb-2" onChange={(e) => setUserUsername(e.target.value)} required/>
                    <h6>Phone Number</h6>
                    <input type="text" placeholder="Enter the new Phone Number" value={userPhone} name="phone" id="phone" className="mb-2" onChange={(e) => setUserPhone(e.target.value)} required/>
                    <button className="small_main_btn mt-3">Update</button>
                    <button className="small_main_btn" onClick={() => setViewUpdate(false)}>Back</button>
                    </form>
                </div>
            </div>

            </> }

            <div className="p-3 m-4">
                <h5>Upcoming Appointments</h5>
                <div className="card-container cursor-pointer">
                {cardsUpComing.map((card, index) => (
                        <div className="card" key={index}>
                        <div className="card-content">
                            <h2 className="card-title">Service: { card.serviceName }</h2>
                            <p className="card-description">Salon : { card.businessName }</p>
                            <p className="card-description">Date : { card.year }/{ card.month }/{ card.date }</p>
                            <p className="card-description">Time : { card.time }</p>
                            <button className="btn btn-danger" onClick={() => deleteAppointment(card.appointmentId)}>Delete</button>
                        </div>
                        </div>
                    ))}
                </div>
            </div>


            <div className="p-3 m-4">
                <h5>Completed Appointments</h5>
                <div className="card-container cursor-pointer">
                {cardsCompleted.map((card, index) => (
                        <div className="card" key={index}>
                        <div className="card-content">
                            <h4 className="card-title">Service: { card.serviceName }</h4>
                            <p className="card-description">Salon : { card.businessName }</p>
                            <p className="card-description">Date : { card.year }/{ card.month }/{ card.date }</p>
                            <p className="card-description">Time : { card.time }</p>
                            <p>completed</p>
                        </div>
                        </div>
                    ))}
                </div>
                
            </div>


        </div>
    </div>
    </>
  );
};
