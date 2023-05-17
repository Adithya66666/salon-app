import React from "react";
import './Home.css';
import './Css/Login.css';
import { useNavigate } from "react-router-dom";

import { useParams } from "react-router-dom";

export const ViewAppointment = () => {

    const {appointmentId} = useParams();


    
  const navigate = useNavigate();
  const viewSalon = (id) => {
    navigate(`/viewService/${id}`);
  }
  
  
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


    const rates = [
        {
          name: 'Adithya Bandara',
          rate: '5.0',
          comment: 'This salon is amazing! I had gotten an unfortunate haircut from another establishment and she spent the time fixing every detail of my hair until it was perfect. She’s so skilled and so sweet. Highly recommend!',
        },
        {
          name: 'Adithya Bandara',
          rate: '5.0',
          comment: 'This salon is amazing! I had gotten an unfortunate haircut from another establishment and she spent the time fixing every detail of my hair until it was perfect. She’s so skilled and so sweet. Highly recommend!',
        },
        {
            name: 'Adithya Bandara',
            rate: '5.0',
            comment: 'This salon is amazing! I had gotten an unfortunate haircut from another establishment and she spent the time fixing every detail of my hair until it was perfect. She’s so skilled and so sweet. Highly recommend!',
          },
          {
            name: 'Adithya Bandara',
            rate: '5.0',
            comment: 'This salon is amazing! I had gotten an unfortunate haircut from another establishment and she spent the time fixing every detail of my hair until it was perfect. She’s so skilled and so sweet. Highly recommend!',
          },
          {
            name: 'Adithya Bandara',
            rate: '5.0',
            comment: 'This salon is amazing! I had gotten an unfortunate haircut from another establishment and she spent the time fixing every detail of my hair until it was perfect. She’s so skilled and so sweet. Highly recommend!',
          },
      ];

  return (
    <>
      <div className="main">
        <div className="contentContainer">
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

            <div className="twoElement_element">
                    <h4>Our Services</h4>

                    <div className="card-container">
                    {cards.map((card, index) => (
                        <div className="card" key={index} onClick={() => viewSalon(card.title)}>
                        <img src={card.imageUrl} alt={card.title} className="salonCardImg" />
                        <div className="rateBar"><img src="star.png" alt="" className="rateBarStart" /><h5>5.0</h5></div>
                        <div className="card-content">
                            <h2 className="card-title">{card.title}</h2>
                            <p className="card-description">{card.description}</p>
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
