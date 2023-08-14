import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { useState,useEffect } from "react";
import { getDatabase, ref, child, get, set,remove, serverTimestamp } from "firebase/database";
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


  const [viewReviews,setViewReviews] = useState(false)


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
        getSalon(); // Call getSalon only if the user is authenticated
      } else {
        setUserId(null);
      }
    });
  
    // Cleanup the listener
    return () => unsubscribe();
  }, []);

  const [selectedServiceId,setSelectedServiceId] = useState("")
  const [viewServiceBox,setViewServiceBox] = useState(false)
  const [viewServiceBoxLoading,setViewServiceBoxLoading] = useState(false)

  //selected service data
  const [selectedServiceName,setSelectedServiceName] = useState("")
  const [selectedServiceDescription,setSelectedServiceDescription] = useState("")
  const [selectedServiceAmount,setSelectedServiceAmount] = useState("")
  const [selectedServiceImage,setSelectedServiceImage] = useState("")
  const [selectedSellerId,setSelectedSellerId] = useState("")

  const navigate = useNavigate();

  const [businessName,setbusinessName] = useState("")
  const [ownerName,setownerName] = useState("")
  const [phone,setPhone] = useState("")
  const [address,setAddress] = useState("")
  const [rate,setRate] = useState("")


  const [viewLoadingOnAdd,setViewLoadingOnAdd] = useState(false);


  const getSalon = async () => {
    if (auth.currentUser) { // Add a check here
      setLoading(true);
      const dbRef = ref(getDatabase());
      const snapshot = await get(child(dbRef, `Seller/${auth.currentUser.uid}`));
      if (snapshot.exists()) {
        setbusinessName(snapshot.child("businessName").val())
        setownerName(snapshot.child("ownerName").val())
        setPhone(snapshot.child("phone").val())
        setAddress(snapshot.child("address").val())
        setRate("5.0")
      } else {
        // Handle the case when snapshot doesn't exist
      }
      setLoading(false);
    }
  }

  const viewService = async (id) => {
    setViewServiceBoxLoading(true);
    setSelectedServiceId(id)
    setViewServiceBox(true);

    const dbRef = ref(getDatabase());
  const snapshot = await get(child(dbRef, `Service/${id}`));
  if (snapshot.exists()) {

    setSelectedServiceName(snapshot.child("serviceName").val());
    setSelectedServiceDescription(snapshot.child("serviceDescription").val()); 
    setSelectedServiceAmount(snapshot.child("amount").val()); 
    setSelectedSellerId(snapshot.child("sellerId").val()); 

    const storageReff = storageRef(storage,`service/${snapshot.child("serviceId").val()}`);
    const imageUrl = getDownloadURL(storageReff);
    const url = await imageUrl;
    setSelectedServiceImage(url);
    setViewServiceBoxLoading(false);
  }

  }

  const changeView = () => {
    navigate(`/`);
  }
  const viewAppointments = () => {
    navigate(`/Seller/Appointments`);
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


  /*
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

  }*/


  const handleServiceAdd = async (e) => {
    e.preventDefault();
  
    setViewLoadingOnAdd(true);
    const uniqueId = uuidv4();
    const data = {
      serviceName: e.target.serviceName.value,
      serviceDescription: e.target.serviceDescription.value,
      amount: e.target.amount.value,
      img: e.target.img.files[0],
    };
  
    const firebaseData = {
      serviceName: e.target.serviceName.value,
      serviceDescription: e.target.serviceDescription.value,
      amount: e.target.amount.value,
      serviceId: uniqueId,
      sellerId: auth.currentUser.uid,
    };
  
    const db = getDatabase();
    const dataRef = ref(db, `Service/${uniqueId}`);
  
    try {
      // First, store the service data in the database
      await set(dataRef, firebaseData);
  
      // Then, upload the image to Firebase Storage
      const storageReff = storageRef(storage, `service/${uniqueId}`);
      await uploadBytes(storageReff, data.img);
  
      // Alert and actions after successful upload
      alert("Service uploaded successfully");
      setAddService(false);
      setViewLoadingOnAdd(false);
      getData(); // Call the getData function to update UI with new data
    } catch (error) {
      console.error("Error adding service:", error);
      alert("Failed to add service. Error occurred");
      setViewLoadingOnAdd(false);
    }
  };
  

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
  const snapshot = await get(child(dbRef, `Service`));
    if (snapshot.exists()) {
      const tempCards = [];
      snapshot.forEach((childSnapshot) => {
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
      setLoading(false);

    } else {

    }

    loadImages()
}

  useEffect(() => {
    getData();
  }, []);


  const deleteService = async (serviceId) => {
    const db = getDatabase();
    const serviceRef = ref(db, `Service/${serviceId}`);
  
    try {
      await remove(serviceRef);
      console.log('Service deleted successfully');
      getData()
      setViewServiceBox(false)
      setViewServiceBoxLoading(false)
      // Perform any additional actions after deleting the service
    } catch (error) {
      console.error('Failed to delete service:', error);
      // Handle the error accordingly
    }
  }

  const resetService = async (serviceId) => {
    viewService(serviceId)
  }


  const handleUpdateService = async (e) => {
    e.preventDefault()
    const firebaseData = {
      serviceName: e.target.serviceName.value,
      serviceDescription: e.target.serviceDescription.value,
      amount: e.target.serviceAmount.value,
      serviceId: selectedServiceId,
      sellerId: selectedSellerId,
    }
    const db = getDatabase();
    const dataRef = ref(db, `Service/${selectedServiceId}`);
    await set(dataRef, firebaseData)
    .then(() => {
      viewService(selectedServiceId)
    })
    .catch((error) => {
      alert("Failed to update service. Error occurred")
    });
  }


  const [reviews, setReviews] = useState([]);

    const getReviews = async () => {
      const dbRef = ref(getDatabase());
      const snapshot = await get(child(dbRef, `Review`));
        if (snapshot.exists()) {
          const tempCards = [];
          snapshot.forEach((childSnapshot) => {
            if(childSnapshot.child("sellerId").val() === auth.currentUser.uid){
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

  return (
    <>

    <div>
        <div className="topBar">
          <div className="topBarActions">
            <h6 className="text m-2">Switch your view seller to buyer</h6>
            <button className="btn btn-primary" onClick={changeView}>Swtich to Buyer</button>
          </div>
          <div className="topBarActions">
            <h6 className="text m-2">Received Appointments</h6>
            <button className="btn btn-warning" onClick={viewAppointments}>Appointments</button>
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
              <img src="../hairstyle.png" alt="" />
          </div>
          <div>
              <h1>{ businessName }</h1>
              <h6>{ ownerName }</h6>
              <h6>{ phone }</h6>
              <h6>{ address }</h6>

              { !viewReviews && <>
                <button className="btn btn-success" onClick={() => setViewReviews(true)}>View Reviews</button>
              </>}
              { viewReviews && <>
                <button className="btn btn-success" onClick={() => setViewReviews(false)}>Back to home</button>
              </>}

          </div>
        </div>

        { !viewReviews && <>
        

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

            { viewLoadingOnAdd && <>
              <h4>Loading...</h4>
            </> }
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

      
      <div className="w-100 border d-flex">

      <div className="card-container w-50 your-service-container">
          {cards.map((card, index) => (
              <div className="card" key={index} onClick={() => viewService(card.serviceId)}>
                <img src={images[index]} alt="" className="salonCardImg" />
                <div className="card-content">
                    <h2 className="card-title">{card.serviceName}</h2>
                    <p className="card-description">{card.serviceDescription}</p>
                    <p className="card-description">Rs.{card.amount}.00</p>
                </div>
              </div>
          ))}
        </div>
        <div className="card-container w-50 your-service-view">
          <h3 className="text text-secondary">View Service</h3>

          { viewServiceBox && !viewServiceBoxLoading && <>
            
            <div className="w-100 d-flex justify-content-center align-items-center flex-column">
              <img src={selectedServiceImage} width={300} alt="" />
              <h5 className="mt-3 text text-secondary">{selectedServiceName}</h5>
              <h6 className="m-3 text text-secondary text-center p-2">{selectedServiceDescription}</h6>
              <h4 className="m-4 text text-secondary">Rs.{selectedServiceAmount}.00</h4>
            </div>


            <form onSubmit={handleUpdateService} className="w-75">
              <label htmlFor="serviceName">Service Name</label>
              <input type="text" placeholder={selectedServiceName} name="serviceName" id="serviceName" className="w-100"/>

              <label htmlFor="serviceName">Service Description</label>
              <input type="text" placeholder={selectedServiceDescription} name="serviceDescription" id="serviceDescription" className="w-100"/>

              <label htmlFor="serviceName">Service Amount</label>
              <input type="number" placeholder={selectedServiceAmount} name="serviceAmount" id="serviceAmount" className="w-100"/>

              <div className="w-100 d-flex justify-content-center align-items-center">
                <button type="button" className="btn btn-success w-50 m-2"  onClick={() => resetService(selectedServiceId)}>Reset</button>
                <button type="submit" className="btn btn-warning w-50">Update</button>
              </div>
            </form>


            <div className="w-100 d-flex justify-content-center align-items-center flex-column">
              <button type="button" className="btn btn-danger w-50 m-2" onClick={() => deleteService(selectedServiceId)}>Delete</button>
            </div>

          </> }

            { viewServiceBox && viewServiceBoxLoading && <>
            
            <div className="w-100 h-100 d-flex justify-content-center align-items-center flex-column">
              <h5 className="mt-3 text text-secondary">Loading...</h5>
            </div>

            </> }

            { !viewServiceBox && !viewServiceBoxLoading && <>
            
              <div className="w-100 h-100 d-flex justify-content-center align-items-center flex-column">
              <img src="nodata.png" width="300" alt="" />
              <h5 className="mt-3 text text-secondary">Select a service to view</h5>
              </div>

            </> }

        </div>

      </div>

        
        </>}

        { viewReviews && <>
        
        <h4>Your Reviews</h4>

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
                              <img src="../yellow.png" alt="" />
                            </div>
                          ))}
                          </div>
                        </div> 
                      </div>
                      <div className="reviewInnerElement">{ rate.date }</div>
                    </div>
                    <div className="reviewBottom">
                      { rate.review }
                    </div>
                </div>
              </div>
          ))}
          </div>
        
        </>}

        
      </> }
      </div>
    </div>
    </>
  );
};
