import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { useState,useEffect } from "react";
import { getDatabase, ref, child, get, set,remove } from "firebase/database";
import { v4 as uuidv4 } from 'uuid';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";


export const Seller = () => {

  const storage = getStorage();

  //useStates
  const [loader,setLloader] = useState(true);
  const [isUserRegistered,setIsUserRegistered] = useState(false);
  const [isUserVerified,setIsUserVerified] = useState(false);
  const [userIndex, setUserId] = useState(null);

  const [viewAddService,setAddService] = useState(false);


  //checking this person is registered as a seller
  const checkUser = async (userId) => {
    setLloader(true);
    const dbRef = ref(getDatabase());
      const snapshot = await get(child(dbRef, `Seller/${userId}`));
        if (snapshot.exists()) {
          setIsUserRegistered(true);
          if(snapshot.child("isVerified").val() === "true"){
            setIsUserVerified(true);
          }else{
            setIsUserVerified(false);
          }
        } else {
          setIsUserRegistered(false);
        }

        setLloader(false);

  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
        checkUser(user.uid);
      } else {
        setUserId(null);
      }
    });
  
    // Cleanup the listener
    return () => unsubscribe();
  }, []);

        
  const navigate = useNavigate();
  const viewService = (id) => {
    navigate(`/viewService/${id}`);
  }

  const changeView = () => {
    navigate(`/`);
  }

  const handleApply = async (e) => {
    e.preventDefault()
      const data = {
        businessName: e.target.businessName.value,
        ownerName: e.target.ownerName.value,
        employees: e.target.employees.value,
        brNumber: e.target.brNumber.value,
        phone: e.target.phoneNumber.value,
        address: e.target.address.value,
        isVerified: "false",
      }

      const db = getDatabase();
        const dataRef = ref(db, `Seller/${userIndex}`);
        await set(dataRef, data)
        .then(() => {
            window.location.reload()
        })
        .catch((error) => {
          alert("Failed to apply. Error occurred")
        });

  }


  const handleServiceAdd = async (e) => {
    e.preventDefault()

    const uniqueId = uuidv4();
    const data = {
      serviceName: e.target.serviceName.value,
      serviceDescription: e.target.serviceDescription.value,
      amount: e.target.amount.value,
      img: e.target.img.files[0],
    }

    const firebaseData = {
      serviceName: e.target.serviceName.value,
      serviceDescription: e.target.serviceDescription.value,
      amount: e.target.amount.value,
      serviceId: uniqueId,
      sellerId: auth.currentUser.uid,
    }
    const db = getDatabase();
    const dataRef = ref(db, `Service/${uniqueId}`);
    await set(dataRef, firebaseData)
    .then(() => {
      try {
        // Upload the file to Firebase Storage
        const storageReff = storageRef(storage, `service/${uniqueId}`);
        uploadBytes(storageReff, data.img);
        alert("Service uploaded successfully");
        setAddService(false);
        getData()
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    })
    .catch((error) => {
      alert("Failed to add service. Error occurred")
    });

  }

  const [cards, setCards] = useState([]);

const getData = async () => {
  setLloader(true);
  const dbRef = ref(getDatabase());
  const snapshot = await get(child(dbRef, `Service`));
    if (snapshot.exists()) {
      const tempCards = [];
      snapshot.forEach(async(childSnapshot) => {
        if(childSnapshot.child("sellerId").val() === auth.currentUser.uid){
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
      setLloader(false);

    } else {

    }
}

  useEffect(() => {
    getData();
  }, []);

  return (
    <>

    <div>
      <div className="topBar">
          <div className="topBarActions">
            <h6>Switch your view seller to buyer</h6>
            <button className="small_main_btn" onClick={changeView}>Swtich to Buyer</button>
          </div>
        </div>
      <div className="contentContainer">

      { loader && <>
        <h5 className="w-100 text-center">Loading</h5>
      </>}

      { !isUserRegistered && !isUserVerified && !loader && <>
      
        <div className="container">
          <img src="scissors.png" alt="Logo" className="logo" />
          <h1 className="text-center">Scissors</h1>
          <h4 className="text-center">Seller Registration</h4>
          <form onSubmit={handleApply}>
            <div className="form-group">
              <label htmlFor="businessName">Business Name:</label>
              <input type="text" id="businessName" name="businessName" required />
            </div>
            <div className="form-group">
              <label htmlFor="ownerName">Owner's Full Name:</label>
              <input type="text" id="ownerName" name="ownerName" required />
            </div>
            <div className="form-group">
              <label htmlFor="employees">Number of employees:</label>
              <input type="text" id="employees" name="employees" required />
            </div>
            <div className="form-group">
              <label htmlFor="brNumber">Business Registration Number:</label>
              <input type="text" id="brNumber" name="brNumber" required />
            </div>
            <div className="form-group">
              <label htmlFor="phoneNumber">Business Phone Number:</label>
              <input type="tel" id="phoneNumber" name="phoneNumber" required />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address:</label>
              <input type="address" id="address" name="address" required />
            </div>
            <button type="submit" className="btn_main">Apply</button>
          </form>
        </div>
      
      </> }

      { !isUserVerified && isUserRegistered && !loader && <>
        <div className="pendingConfirmation">
          <h4>Your seller account is not approved by the admins. check again later.</h4>  
        </div>
      </> }

      { isUserRegistered && isUserVerified && !loader && <>

        <div className="border-bottom mb-4 topViewBar">
          <div className="imgViewBar">
              <img src="../salonCard.jpg" alt="" />
          </div>
          <div>
              <h1>Salon Name</h1>
              <h6>Salon owners name</h6>
              <h6>5.0 Rating</h6>
          </div>
        </div>

        { !viewAddService &&  
        <div className="w-100 mb-3 d-flex justify-content-left align-items-center">
        <h6>Add New Service</h6>
        <button className="btn btn-primary m-3" onClick={() => setAddService(true)}>Add Service</button>
        </div>
        }
        
        { viewAddService &&  
        <div className="w-50 m-auto">

        <div className="w-100 mb-3 d-flex justify-content-left align-items-center">
          <h6>Add New Service</h6>
          <button className="btn btn-warning m-3" onClick={() => setAddService(false)}>Back</button>
        </div>

        <form onSubmit={handleServiceAdd}>
            <div className="form-group">
              <label htmlFor="businessName">Serivce Name:</label>
              <input type="text" id="serviceName" name="serviceName" required />
            </div>
            <div className="form-group">
              <label htmlFor="ownerName">Service Description:</label>
              <input type="text" id="serviceDescription" name="serviceDescription" required />
            </div>
            <div className="form-group">
              <label htmlFor="employees">Amount:</label>
              <input type="text" id="amount" name="amount" required />
            </div>
            <div className="form-group">
              <label htmlFor="brNumber">Image:</label>
              <input type="file" id="img" name="img" accept="image/*" required />
            </div>
            <button type="submit" className="btn_main">Add Service</button>
          </form>
      </div>
      }
        
        <div className="card-container">
          {cards.map((card, index) => (
              <div className="card" key={index} onClick={() => viewService(card.title)}>
                <img src={card.img} alt="" className="salonCardImg" />
                <div className="rateBar">
                  <img src="star.png" alt="" className="rateBarStart" />
                  <h5>5.0</h5>
                </div>
                <div className="card-content">
                    <h2 className="card-title">{card.serviceName}</h2>
                    <p className="card-description">{card.serviceDescription}</p>
                    <p className="card-description">Rs.{card.amount}.00</p>
                </div>
              </div>
          ))}
        </div>
      </> }
      </div>
    </div>
    </>
  );
};
