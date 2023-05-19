import React from "react";
import './Home.css';
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { useState,useEffect } from "react";
import { getDatabase, ref, child, get, set,remove, serverTimestamp } from "firebase/database";
import { v4 as uuidv4 } from 'uuid';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";


export const Home = () => {

  const storage = getStorage();

  const navigate = useNavigate();
const viewSalon = (id) => {
  navigate(`/viewAppointment/${id}`);
}

  const changeView = () => {
    navigate(`/seller`);
  }
  const [cards, setCards] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

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
    setLoading(true);
    const dbRef = ref(getDatabase());
    const snapshot = await get(child(dbRef, `Seller`));
      if (snapshot.exists()) {
        const tempCards = [];
        snapshot.forEach((childSnapshot) => {
            const data = {
              businessName: childSnapshot.child("businessName").val(),
              ownerName: childSnapshot.child("ownerName").val(),
              phone: childSnapshot.child("phone").val(),
              address: childSnapshot.child("address").val(),
              rate: "5.0",
              salonId: childSnapshot.key,
            };
            tempCards.push(data);
        })
  
        setCards(tempCards);
        setLoading(false);
  
      } else {
  
      }
  }
  
  useEffect(() => {
    getData();
  }, []);

  return (
    <>
    <div className="main">

      <div className="topBar">
        <div className="topBarActions">
          <h6>Switch your view buyer to seller</h6>
          <button className="small_main_btn" onClick={changeView}>Swtich to Seller</button>
        </div>
      </div>

      <div className="contentContainer">

        <h3 className="sub_text_wide">Available Salons</h3>

        { loading && <>
        
        <h6 className="text-center text text-secondary">Loading...</h6>

        </> }

        { !loading && <>
        
          {cards.map((card, index) => (
            <div className="card-container">
              <div className="card" key={index} onClick={() => viewSalon(card.salonId)}>
              <img src="hairstyle.png" alt="" className="salonCardImg m-5" />
                <div className="rateBar"><img src="star.png" alt="" className="rateBarStart" /><h5>5.0</h5></div>
                <div className="card-content">
                    <h2 className="card-title">{card.businessName}</h2>
                    <p className="card-description">{card.address}</p>
                    <p className="card-description">Phone Number: {card.phone}</p>
                </div>
              </div>
            </div>
          ))}
        
        </> }

      </div>
      
    </div>
    </>
  );
};
