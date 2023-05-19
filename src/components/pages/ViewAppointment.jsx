import React from "react";
import './Home.css';
import './Css/Login.css';
import { useNavigate } from "react-router-dom";

import { useParams } from "react-router-dom";
import { useState,useEffect } from 'react';

import { auth } from "../config/firebase";
import { getDatabase, ref, child, get, set,remove, serverTimestamp } from "firebase/database";
import { v4 as uuidv4 } from 'uuid';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";


export const ViewAppointment = () => {
    
  const navigate = useNavigate();
  const viewSalon = (id) => {
    navigate(`/viewService/${id}`);
  }

  const [cards, setCards] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);

  const {salonId} = useParams();

  const storage = getStorage();

  const loadImages = async () => {
    const dbRef = ref(getDatabase());
    const snapshot = await get(child(dbRef, "Service"));
    if (snapshot.exists()) {
      const promises = [];
      snapshot.forEach((childSnapshot) => {
        if (childSnapshot.child("sellerId").val() === auth.currentUser.uid) {
          const storageReff = storageRef(
            storage,
            `service/${childSnapshot.child("serviceId").val()}`
          );
          const promise = getDownloadURL(storageReff);
          promises.push(promise);
        }
      });
  
      const urls = await Promise.all(promises);
      const temp = [];
      urls.forEach((url) => {
        temp.push(url)
      });
      setImages(temp);
  
      // setImages(temp);
    }
  };

  const getData = async () => {
    const dbRef = ref(getDatabase());
    const snapshot = await get(child(dbRef, `Service`));
      if (snapshot.exists()) {
        const tempCards = [];
        snapshot.forEach((childSnapshot) => {
          if(childSnapshot.child("sellerId").val() === salonId){
            const data = {
              serviceName: childSnapshot.child("serviceName").val(),
              serviceDescription: childSnapshot.child("serviceDescription").val(),
              amount: childSnapshot.child("amount").val(),
              serviceId: childSnapshot.child("serviceId").val(),
              sellerId: childSnapshot.child("sellerId").val(),
            };
            tempCards.push(data);
          }
        })
  
        setCards(tempCards);
      } else {
  
      }
  
      loadImages()
  }


  const [businessName,setbusinessName] = useState("")
  const [ownerName,setownerName] = useState("")
  const [phone,setPhone] = useState("")
  const [address,setAddress] = useState("")
  const [rate,setRate] = useState("")


  const getSalon = async () => {
    setLoading(true);
    const dbRef = ref(getDatabase());
    const snapshot = await get(child(dbRef, `Seller/${salonId}`));
      if (snapshot.exists()) {
        setbusinessName(snapshot.child("businessName").val())
        setownerName(snapshot.child("ownerName").val())
        setPhone(snapshot.child("phone").val())
        setAddress(snapshot.child("address").val())
        setRate("5.0")
      } else {
      }
      setLoading(false);
  }

    useEffect(() => {
      getData();
    }, []);


    useEffect(() => {
      getSalon();
    }, []);

    const rates = [];

    const rateLoad = async () => {
        alert()
    }


  return (
    <>
      <div className="main">
        <div className="contentContainer">
            <div className="border-bottom mb-4 topViewBar">
                
                <div className="imgViewBar">
                <img src="../hairstyle.png" alt="" />
                </div>
                { !loading && <>

                  <div>
                    <h1>{businessName}</h1>
                    <h6>Owner : {ownerName}</h6>
                    <h6>Ratings : {rate}</h6>
                    <h6>Address : {address}</h6>
                    <h6>Phone Number : {phone}</h6>
                  </div>
                
                </> }
                { loading && <>

                  <div>
                    <h6>Loading...</h6>
                  </div>
                
                </> }
            </div>

            <div className="twoElement_element">
                    <h4>Our Services</h4>

                    <div className="card-container">
                    {cards.map((card, index) => (
                        <div className="card" key={index} onClick={() => viewSalon(card.serviceId)}>
                        <img src={images[index]} alt={card.title} className="salonCardImg" />
                        <div className="card-content">
                            <h2 className="card-title">{card.serviceName}</h2>
                            <p className="card-description">{card.serviceDescription}</p>
                            <h3 className="card-title text text-center">Rs.{card.amount}.00</h3>
                        </div>
                        </div>
                    ))}
                    </div>
                </div>
                <div className="twoElement_element">
                    <h5 className="border-bottom p-2">Customer Ratings</h5>
                    <div className="card-container">
                    {rates.map((rate, index) => (
                        <div className="card" key={index}>
                        <div className="card-content">
                            <h2 className="card-title">{rate.name} {rate.rate}</h2>
                            <p className="card-description">{rate.comment}</p>
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
