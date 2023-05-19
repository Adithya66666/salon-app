import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import {useEffect } from "react";
import { getDatabase, ref, child, get, set,remove, serverTimestamp } from "firebase/database";
import { v4 as uuidv4 } from 'uuid';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";


export const SellerAppointments = () => {
    const navigate = useNavigate();
    const storage = getStorage();

    const changeView = () => {
        navigate(`/Seller`);
      }

    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentView, setCurrentView] = useState("Upcoming Appointments");



const getData = async () => {
  setLoading(true);
  setCurrentView("Upcoming Appointments")
  const dbRef = ref(getDatabase());
  const snapshot = await get(child(dbRef, `Appointment`));
    if (snapshot.exists()) {
      const tempCards = [];
      snapshot.forEach((childSnapshot) => {
        if(childSnapshot.child("sellerId").val() === auth.currentUser.uid && 
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

      setCards(tempCards);
      setLoading(false);

    } else {

    }
}

  useEffect(() => {
    getData();
  }, []);

  const completeAppointment = async (id) => {
    const db = getDatabase();
        const dataRef = ref(db, `Appointment/${id}/status`);
        await set(dataRef, "completed")
        .then(() => {
            getData()
        })
        .catch((error) => {
          alert("Failed to apply. Error occurred")
        });
  }



  const getDataCompleted = async () => {
    setLoading(true);
    setCurrentView("Completed Appointments")
    const dbRef = ref(getDatabase());
    const snapshot = await get(child(dbRef, `Appointment`));
      if (snapshot.exists()) {
        const tempCards = [];
        snapshot.forEach((childSnapshot) => {
          if(childSnapshot.child("sellerId").val() === auth.currentUser.uid && 
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
  
        setCards(tempCards);
        setLoading(false);
  
      } else {
  
      }
  }

  return (
    <>
    <div>
        <div className="topBar">
          <div className="topBarActions">
            <button className="btn btn-primary" onClick={changeView}>Seller Home</button>
          </div>
        </div>

      <div className="contentContainer">
        <div className="border-bottom p-3 d-flex justify-content-between align-items-center">

            <h3 className="text text-secondary">Received Appointments</h3>
            <div>
            <button className="btn btn-success m-2" onClick={getData}>Upcoming</button>
            <button className="btn btn-primary" onClick={getDataCompleted}>Completed</button>
            </div>
        </div>

        <h5 className="text text-secondary m-4">{ currentView }</h5>
{ !loading && <>

    <div>
            <div className="card-container w-100">
                {cards.map((card, index) => (
                <div className="container border" key={index}>
                    <div>
                        <h2>Customer name: {card.cName}</h2>
                        <p>Date: {card.year}/{card.month}/{card.date}</p>
                        <p>Time: {card.time}</p>
                        <p>Service Name: {card.serviceName}</p>
                        <p>Payment type:{card.paymentMethod}</p>
                        <button className="btn btn-success" onClick={() => completeAppointment(card.appointmentId)}>Complete</button>
                    </div>
                </div>
            ))}
            </div>
        </div>

</>  }  

{ loading && <>

        <div className="container">
            Loading...
        </div>

</>  }  


      </div>
    </div>

    </>
  );
};
