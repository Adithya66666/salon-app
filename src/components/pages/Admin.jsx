import React, { useState } from "react";
import { getDatabase, ref, child, get, set,remove } from "firebase/database";
import { useEffect } from "react";
import { auth } from "../config/firebase";

export const Admin = () => {

const [cards, setCards] = useState([]);
const [loading, setLoading] = useState(true);

const getData = async () => {
  setLoading(true);
  const dbRef = ref(getDatabase());
  const snapshot = await get(child(dbRef, `Seller`));
    if (snapshot.exists()) {
      const tempCards = [];
      snapshot.forEach((childSnapshot) => {
        if(childSnapshot.child("isVerified").val() === "false"){
          const data = {
            address: childSnapshot.child("address").val(),
            btNumber: childSnapshot.child("brNumber").val(),
            businessName: childSnapshot.child("businessName").val(),
            employees: childSnapshot.child("employees").val(),
            isVerified: childSnapshot.child("isVerified").val(),
            ownerName: childSnapshot.child("ownerName").val(),
            phone: childSnapshot.child("phone").val(),
            sellerId: childSnapshot.key,
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


const verify = async (id) => {
  //change the isVerified to true
  const db = getDatabase();
  const dataRef_fname = ref(db, `Seller/${id}/isVerified`);
  await set(dataRef_fname, "true")
      .then(() => {
        alert("Seller Verified!");
        getData();
      })
      .catch((error) => {
        alert("Failed to update seller. Error occurred!");
      });
}
const reject = async (id) => {
  //delete seller
  const db = getDatabase();
  const dataRef = ref(db, `Seller/${id}`);

  await remove(dataRef)
    .then(() => {
      alert("Seller rejected successfully!");
      getData();
    })
    .catch((error) => {
      alert("Failed to update seller. Error occurred!");
    });

}

  return (
    <>

    <div>
      <div className="contentContainer">

        <h5>Seller Acoount Requests</h5>
        <button className="btn btn-success m-3" onClick={getData}>Refresh</button>

        { !loading && <>

        <div className="card-container">
          {cards.map((card, index) => (
              <div className="cardAdmin" key={index}>
                <div className="rateBar">
                  <h5>{card.businessName}</h5>
                </div>
                <div className="card-content">
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
                      <td>Business Name</td>
                      <td>{card.businessName}</td>
                      </tr>
                      <tr>
                        <td>BR Number</td>
                        <td>{card.btNumber}</td>
                      </tr>
                      <tr>
                        <td>Owner Name</td>
                        <td>{card.ownerName}</td>
                      </tr>
                      <tr>
                        <td>Phone Number</td>
                        <td>{card.phone}</td>
                      </tr>
                      <tr>
                        <td>Number of employees</td>
                        <td>{card.employees}</td>
                      </tr>
                    </tbody>
                    </table>
                    <button className="btn btn-success m-2" onClick={() => verify(card.sellerId)} >Verify</button>
                    <button className="btn btn-danger m-2" onClick={() => reject(card.sellerId)} >Reject</button>
                    </div>
                </div>
              </div>
          ))}
        </div>

        </>}

        { loading && <>
        
        Loading...

        </> }
        
      </div>
    </div>

    </>
  );
};
