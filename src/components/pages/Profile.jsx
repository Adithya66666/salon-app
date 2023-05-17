import React from "react";
import './Footer.css';
import { useState,useEffect } from "react";
import { auth } from "../config/firebase";
import { getDatabase, ref, child, get, set,remove } from "firebase/database";

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
  

    const cards = [
        {
          title: 'Card 2',
          description: 'This is the description for Card 2',
          imageUrl: 'salonCard.jpg',
        },
        {
          title: 'Card 2',
          description: 'This is the description for Card 2',
          imageUrl: 'salonCard.jpg',
        },
        {
          title: 'Card 2',
          description: 'This is the description for Card 2',
          imageUrl: 'salonCard.jpg',
        },
        {
          title: 'Card 2',
          description: 'This is the description for Card 2',
          imageUrl: 'salonCard.jpg',
        },
        {
          title: 'Card 2',
          description: 'This is the description for Card 2',
          imageUrl: 'salonCard.jpg',
        },
        {
          title: 'Card 2',
          description: 'This is the description for Card 2',
          imageUrl: 'salonCard.jpg',
        },
        {
          title: 'Card 2',
          description: 'This is the description for Card 2',
          imageUrl: 'salonCard.jpg',
        },
        {
          title: 'Card 2',
          description: 'This is the description for Card 2',
          imageUrl: 'salonCard.jpg',
        },
        // Add more cards as needed
      ];

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

            

            <div className="border-bottom p-3">
            <button className="small_main_btn mt-5">Upcoming Appointments</button>
            <button className="small_main_btn mt-5">Completed Appointments</button>
            </div>

            <div className="p-3 m-4">
                <h5>Upcoming Appointments</h5>
                <div className="card-container cursor-pointer">
                {cards.map((card, index) => (
                        <div className="card" key={index}>
                        <div className="card-content">
                            <h2 className="card-title">09:00 AM</h2>
                            <p className="card-description">09:00 AM - 10:00 AM</p>
                        </div>
                        </div>
                    ))}
                </div>
            </div>


            <div className="p-3 m-4">
                <h5>Completed Appointments</h5>
                <div className="card-container cursor-pointer">
                {cards.map((card, index) => (
                        <div className="card" key={index}>
                        <div className="card-content">
                            <h2 className="card-title">09:00 AM</h2>
                            <p className="card-description">09:00 AM - 10:00 AM</p>
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
