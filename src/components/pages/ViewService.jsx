import React, {useEffect} from "react";
import './Footer.css';

import { useParams } from "react-router-dom";
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import StripeCheckout from 'react-stripe-checkout';

import { auth } from "../config/firebase";
import { getDatabase, ref, child, get, set,remove, serverTimestamp } from "firebase/database";
import { v4 as uuidv4 } from 'uuid';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";


export const ViewService = () => {

  const [cards, setCards] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);


  const {serviceId} = useParams();

  const [businessName,setbusinessName] = useState("")
  const [ownerName,setownerName] = useState("")
  const [phone,setPhone] = useState("")
  const [address,setAddress] = useState("")
  const [rate,setRate] = useState("")
  const [serviceName,setServiceName] = useState("")
  const [amountService,setAmountService] = useState("")
  const [sellerId,setSellerId] = useState("")
  const [yearA,setYear] = useState("")
  const [monthA,setMonth] = useState("")
  const [dayA,setDay] = useState("")


  const getSalon = async () => {
    const dbRef = ref(getDatabase());
    const snapshot = await get(child(dbRef, `Service/${serviceId}`));
      if (snapshot.exists()) {
        setServiceName(snapshot.child("serviceName").val())
        var sellerId = snapshot.child("sellerId").val()
        setSellerId(sellerId)
        setAmountService(snapshot.child("amount").val())
        const sellerSnap = await get(child(dbRef, `Seller/${sellerId}`));
        if(sellerSnap.exists()){
          setbusinessName(sellerSnap.child("businessName").val())
          setownerName(sellerSnap.child("ownerName").val())
          setPhone(sellerSnap.child("phone").val())
          setAddress(sellerSnap.child("address").val())
          setRate("5.0")
        }
      } else {
  
      }
  }

    useEffect(() => {
      getSalon();
      const sampleArray = [{ data:"" },{ data:"" },{ data:"" },{ data:"" },{ data:"" },{ data:"" }]

      setCards(sampleArray)
    }, []);


    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDateString, setSelectedDateString] = useState(null);
    const [availableDates, setAvailableDates] = useState(null);
    const [dateLoader, setDateLoader] = useState(false);
    const [appointmentStep,setAppointmentStep] = useState("selectDate")
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
    const handleDateChange = (date) => {
        setSelectedDate(date);
      };

    const handleSearchDate = async () => {
      setDateLoader(true)
      if(selectedDate != null){
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth(); // Note: Months are zero-based (0-January, 1-February, etc.)
        const day = selectedDate.getDate();

        setYear(year)
        setMonth(month)
        setDay(day)

        setSelectedDateString()

        const monthC = month + 1
        const selectedDateValue = `${year}/${monthC}/${day}`
        setSelectedDateString(selectedDateValue)
        const array = ["9-11", "11-13", "13-15", "15-17", "17-19", "19-21"];
        const childArray = [];
        const dbRef = ref(getDatabase());
        const snapshot = await get(child(dbRef, `Appointment`));
          if (snapshot.exists()) {
            
            snapshot.forEach((childSnapshot) => {
              var childYear = childSnapshot.child("year").val()
              var childMonth = childSnapshot.child("month").val()
              var childDay = childSnapshot.child("day").val()
              if(year === childYear && monthC === childMonth && childDay === day){
                var childTime = childSnapshot.child("time").val()
                childArray.push(childTime)
              }
            })

            const newArray = array.filter((element) => !childArray.includes(element));
            console.log(newArray)
            setAvailableDates(newArray)
            setAppointmentStep("selectSlot")

          } else {
            setAvailableDates(array)
            setAppointmentStep("selectSlot")
          }

        
      }else{
        alert("Fill the date field")
      }
    }

    const [selectedTimeSlot,setSelectedTimeSlot] = useState("")

    const selectTimeSlot = (index) => {
      var selected = availableDates[index]
      setSelectedTimeSlot(selected)
      setAppointmentStep("confirm")
    }

    const payAndConfirm = async (paymentMethod) => {
      const currentDate = new Date().toLocaleDateString();

      const uniqueId = uuidv4();

      const data = {
        userid: auth.currentUser.uid,
        sellerId: sellerId,
        appointmentId: uniqueId,
        year: yearA,
        month: monthA,
        date: dayA,
        time: selectedTimeSlot,
        paymentMethod: paymentMethod,
        serviceId: serviceId,
        createdDate: currentDate,
        status: "pending",
        cName:cName,
        businessName:businessName,
        serviceName:serviceName,
      };

      if(paymentMethod === "offline"){
        const db = getDatabase();
        const dataRef = ref(db, `Appointment/${uniqueId}`);
        await set(dataRef, data)
        .then(() => {
          setAppointmentStep("Confirmed");
        })
        .catch((error) => {
          alert("Failed to add appointment. Error occurred")
        });
      }else{
        //online payment
      }
    }


    const PaymentForm = () => {
      const handleToken = (token) => {
        const currentDate = new Date().toLocaleDateString();

      const uniqueId = uuidv4();

      const data = {
        userid: auth.currentUser.uid,
        sellerId: sellerId,
        appointmentId: uniqueId,
        year: yearA,
        month: monthA,
        date: dayA,
        time: selectedTimeSlot,
        paymentMethod: "online",
        serviceId: serviceId,
        createdDate: currentDate,
        status: "pending",
        cName:cName,
        businessName:businessName,
        serviceName:serviceName,
      };
        const db = getDatabase();
        const dataRef = ref(db, `Appointment/${uniqueId}`);
        set(dataRef, data)
        .then(() => {
          setAppointmentStep("Confirmed");
        })
        .catch((error) => {
          alert("Failed to add appointment. Error occurred")
        });
      };
      return (
        <StripeCheckout
          stripeKey="pk_test_51MSwdJASB7FocmM4BhD5aTfg3tRFmIiMcjiiswZYfSOWll3ESrmWR2mB7c8Tl35M3AaEotrnZGkWfSxdvW88nhjz00Yj3f3y8C"
          token={handleToken}
          name="Appointment Payment"
          amount={1000}
          currency="LKR"
        />
      );
    }
    


  return (
    <>
    <div className="main">
        <div className="contentContainer">
            <div className="border-bottom mb-4 topViewBar">
                <div className="imgViewBar">
                    <img src="../hairstyle.png" alt="" />
                </div>
                <div>
                    <h1>{businessName}</h1>
                    <h6>{ownerName}</h6>
                    <h6>Address : {address}</h6>
                    <h6>Phone : {phone}</h6>
                    <h6>Rate : {rate}</h6>
                </div>
            </div>

            <h5>Make your appointment for { serviceName } in { businessName }</h5>

            <div className="formContainer">
              { appointmentStep === "selectDate" && <>
                <div className="appintmentDataCon">
                      <h6>Pick a date to your appointment</h6>
                      <DatePicker selected={selectedDate} onChange={handleDateChange} />
                      <button className="btn_main mt-3" onClick={handleSearchDate}>Next</button>
                </div>
              </> }

              { appointmentStep === "selectSlot" && <>

              <div className="appintmentDataCon">
                    Pick a time Slot

                    <div className="card-container cursor-pointer">
                    {availableDates.map((time, index) => (
                        <div className="card" key={index}>
                          { time === "9-11" && <>
                            <div className="card-content time-slot" onClick={() => selectTimeSlot(index)}>
                              <h2 className="card-title">09:00 AM</h2>
                              <p className="card-description">09:00 AM - 11:00 AM</p>
                            </div>
                          </>}
                          { time === "11-13" && <>
                          <div className="card-content time-slot" onClick={() => selectTimeSlot(index)}>
                              <h2 className="card-title">11:00 AM</h2>
                              <p className="card-description">11:00 AM - 01:00 PM</p>
                            </div>
                          </>}
                          { time === "13-15" && <>
                          <div className="card-content time-slot" onClick={() => selectTimeSlot(index)}>
                              <h2 className="card-title">01:00 PM</h2>
                              <p className="card-description">01:00 PM - 03:00 PM</p>
                            </div>
                          </>}
                          { time === "15-17" && <>
                          <div className="card-content time-slot" onClick={() => selectTimeSlot(index)}>
                              <h2 className="card-title">03:00 PM</h2>
                              <p className="card-description">03:00 PM - 05:00 PM</p>
                            </div>
                          </>}
                          { time === "17-19" && <>
                          <div className="card-content time-slot" onClick={() => selectTimeSlot(index)}>
                              <h2 className="card-title">05:00 PM</h2>
                              <p className="card-description">05:00 PM - 07:00 PM</p>
                            </div>
                          </>}
                          { time === "19-21" && <>
                          <div className="card-content time-slot" onClick={() => selectTimeSlot(index)}>
                              <h2 className="card-title">07:00 PM</h2>
                              <p className="card-description">07:00 PM - 09:00 PM</p>
                            </div>
                          </>}
                        </div>
                    ))}
                    <button className="btn_main mt-3" onClick={() => setAppointmentStep("selectDate")}>Back</button>
                    </div>
                </div>
              
              </>} 
              { appointmentStep === "confirm" && <>
              
              <div className="appintmentDataCon">
                    Confirm your appointment

                    <div>
                    <table className="w-100">
                    <thead>
                        <tr>
                        <th>Description</th>
                        <th>Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td>Salon Name</td>
                        <td>{ businessName }</td>
                        </tr>
                        <tr>
                        <td>Service Name</td>
                        <td>{ serviceName }</td>
                        </tr>
                        <tr>
                        <td>Appointment Date</td>
                        <td>{ selectedDateString }</td>
                        </tr>
                        <tr>
                        <td>Appointment Time</td>
                        <td>{ selectedTimeSlot === "9-11" && <>9.00 AM - 11.00 AM</>}{ selectedTimeSlot === "11-13" && <>11.00 AM - 1.00 PM</>}{ selectedTimeSlot === "13-15" && <>1.00 PM - 3.00 PM</>}
                        { selectedTimeSlot === "15-17" && <>3.00 PM - 5.00 PM</>}{ selectedTimeSlot === "17-19" && <>5.00 PM - 7.00 PM</>}{ selectedTimeSlot === "19-21" && <>7.00 PM - 9.00 PM</>}</td>
                        </tr>
                        <tr>
                        <td>Amount</td>
                        <td>Rs.{ amountService }.00</td>
                        </tr>
                    </tbody>
                    </table>
                    </div>

                    <PaymentForm />
                    <button className="btn_main mt-3" onClick={() => payAndConfirm("offline")}>Pay At The Salon And Confirm The Appointment</button>
                    <button className="btn_main mt-3" onClick={() => setAppointmentStep("selectSlot")}>Back</button>

                </div>
              
              </> }
              { appointmentStep === "Confirmed" && <>
              
                    <div className="container p-5 d-flex flex-column justify-content-center align-items-center">
                      <img src="../check.png" width="200" height="200" alt="" className="mb-4" />
                      <h3 className="text text-secondary text-center">Appointment Added Successfully</h3>
                      <button className="btn btn-success mt-3" onClick={() => window.location.replace("/")}>Back to Home</button>
                    </div>

              </>}
                
            </div>

        </div>
    </div>
    </>
  );
};
