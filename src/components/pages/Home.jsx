import React from "react";
import './Home.css';
import { useNavigate } from "react-router-dom";

export const Home = () => {

  const navigate = useNavigate();
const viewSalon = (id) => {
  navigate(`/viewAppointment/${id}`);
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

  const changeView = () => {
    navigate(`/seller`);
  }

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
      
    </div>
    </>
  );
};
