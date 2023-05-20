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

  const [cName,setCustomerName] = useState("")

  const getUser = async () => {
    const dbRef = ref(getDatabase());
    const snapshot = await get(child(dbRef, `User/${auth.currentUser.uid}`));
      if (snapshot.exists()) {
        setCustomerName(`${snapshot.child("fname").val()} ${snapshot.child("lname").val()}`)
      }
  }
  useEffect(() => {
    getUser()
  }, []);


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
  const [sellerId,setSellerId] = useState("")
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
        setSellerId(snapshot.key)
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

    }


    const [addReview,setAddReview] = useState(false)
    const [starArray,setStarArray] = useState(['../gray.png','../gray.png','../gray.png','../gray.png','../gray.png']);
    const [selectedStarCount,setSelectedStarCount] = useState(0)
    const startSelect = async (index) => {
      setSelectedStarCount(index + 1)
      const tempArray = []
      for(let count = 0; count < 5; count++){
        if(count <= index){
          tempArray.push("../yellow.png");
        }else{
          tempArray.push("../gray.png");
        }
      }
      setStarArray(tempArray)
    }

    const handleAddReview = async (e) => {
      e.preventDefault()

      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const uniqueId = uuidv4();
      const data = {
        starCount: selectedStarCount,
        review: e.target.reviewDescription.value,
        sellerId: sellerId,
        userId: auth.currentUser.uid,
        date: `${year}-${month}-${day}`,
        customerName:cName,
      }

      if(data.starCount === 0){
        alert("select a start count");
      }else{
        const db = getDatabase();
        const dataRef = ref(db, `Review/${uniqueId}`);
        set(dataRef, data)
        .then(() => {
          alert("Review Added Successfully!")
          setAddReview(false);
          clearReviewForm();
          getReviews();
        })
        .catch((error) => {
          alert("Failed to add Review. Error occurred")
        });
      }
    }

    const clearReviewForm = () => {
      setSelectedStarCount(0)
      setStarArray(['../gray.png','../gray.png','../gray.png','../gray.png','../gray.png'])
      document.getElementById("reviewDescription").value = ""
    }


    const [reviews, setReviews] = useState([]);

    const getReviews = async () => {
      const dbRef = ref(getDatabase());
      const snapshot = await get(child(dbRef, `Review`));
        if (snapshot.exists()) {
          const tempCards = [];
          snapshot.forEach((childSnapshot) => {
            if(childSnapshot.child("sellerId").val() === salonId){
              const data = {
                starCount: childSnapshot.child("starCount").val(),
                review: childSnapshot.child("review").val(),
                sellerId: childSnapshot.child("sellerId").val(),
                userId: childSnapshot.child("userId").val(),
                date: childSnapshot.child("date").val(),
                customerName: childSnapshot.child("customerName").val(),
                reviewId: childSnapshot.key,
              };
              tempCards.push(data);
            }
          })
    
          setReviews(tempCards);
        } else {
    
        }
        loadImages()
    }
    useEffect(() => {
      getReviews();
    }, []);


    const deleteReview = async (index) => {

      const db = getDatabase();
      const serviceRef = ref(db, `Review/${index}`);
    
      try {
        await remove(serviceRef);
        alert('Review deleted successfully');
        getReviews()
        // Perform any additional actions after deleting the service
      } catch (error) {
        console.error('Failed to delete service:', error);
        // Handle the error accordingly
      }

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
                    <h5 className="border-bottom p-2">Customer Reviews</h5>
                    { !addReview && <>

                      <div><button className="btn btn-warning" onClick={() => setAddReview(true)}>Add Review</button></div>
                    
                    </> }

                    { addReview && <>
                    
                    <div className="container w-100">
                      <form onSubmit={handleAddReview}>

                        <h4 className="text text-center text-secondary">Add Review</h4>

                        <label>Review Rate</label>
                        <h6 className="text-secondary">Select the star count</h6>

                        <div className="starArrayCon">
                          {starArray.map((rate, index) => (
                            <div className="startContainer" key={index}>
                              <img src={rate} alt="" onClick={() => startSelect(index)} />
                            </div>
                          ))}
                        </div>

                        <label>Review Description</label>
                        <textarea name="reviewDescription" id="reviewDescription" cols="30" rows="10" className="w-100 r-none mt-2" required></textarea>
                        <button className="btn btn-success w-100 mt-3">Add Review</button>
                        <button type="button" className="btn btn-danger w-100 mt-1" onClick={clearReviewForm}>Clear</button>
                        <button type="button" className="btn btn-warning w-100 mt-1" onClick={() => setAddReview(false)}>Back</button>
                      </form>
                    </div>
                    
                    </> }
                    <div className="review-container">
                    {reviews.map((rate, index) => (
                        <div className="review-card" key={index}>
                          <div className="review-content">
                              <div className="reviewTop">
                                <div className="reviewInnerElement">
                                  <h3>{ rate.customerName }</h3>
                                  <div className="starRating">
                                    <div>{ rate.starCount } Stars</div>
                                    <div className="reviewStarsCon">
                                    {[...Array(rate.starCount)].map((_, index) => (
                                      <div key={index}>
                                        <img src="../yellow.png" alt=""/>
                                      </div>
                                    ))}
                                    </div>
                                  </div> 
                                </div>
                                <div className="reviewInnerElement">{ rate.date } { rate.userId === auth.currentUser.uid && <><button className="btn btn-danger" onClick={() => deleteReview(rate.reviewId)}>Delete</button></> }</div>
                              </div>
                              <div className="reviewBottom">
                                { rate.review }
                              </div>
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
