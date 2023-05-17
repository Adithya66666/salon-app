import React from "react";
import './Footer.css';

import { useParams } from "react-router-dom";
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export const ViewService = () => {

    const [selectedDate, setSelectedDate] = useState(null);

    const {serviceId} = useParams();

    const handleDateChange = (date) => {
        setSelectedDate(date);
      };


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
                    <h6>Service Name: Service</h6>
                </div>

            </div>

            <h5>Make your appointment for 'service Name' in 'salon name'</h5>

            <div className="formContainer">
                <div className="appintmentDataCon">
                    <h6>Pick a date to your appointment</h6>
                    <DatePicker selected={selectedDate} onChange={handleDateChange} />
                    <button className="btn_main mt-3">Next</button>
                </div>
                <div className="appintmentDataCon">
                    Pick a time Slot

                    <div className="card-container cursor-pointer">
                    {cards.map((card, index) => (
                        <div className="card" key={index}>
                        <div className="card-content">
                            <h2 className="card-title">09:00 AM</h2>
                            <p className="card-description">09:00 AM - 10:00 AM</p>
                        </div>
                        </div>
                    ))}

                    <button className="btn_main mt-3">Next</button>
                    <button className="btn_main mt-3">Back</button>
                    </div>
                </div>
                <div className="appintmentDataCon">
                    personal data


                    <div>
                    <table className="w-100">
                    <thead>
                        <tr>
                        <th>Column 1</th>
                        <th>Column 2</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td>Row 1, Column 1</td>
                        <td>Row 1, Column 2</td>
                        </tr>
                        <tr>
                        <td>Row 2, Column 1</td>
                        <td>Row 2, Column 2</td>
                        </tr>
                        <tr>
                        <td>Row 3, Column 1</td>
                        <td>Row 3, Column 2</td>
                        </tr>
                    </tbody>
                    </table>
                    </div>

                    <button className="btn_main mt-3">Next</button>
                    <button className="btn_main mt-3">Back</button>

                </div>
                <div className="appintmentDataCon">
                    Confirm your appointment

                    <div>
                    <table className="w-100">
                    <thead>
                        <tr>
                        <th>Column 1</th>
                        <th>Column 2</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td>Row 1, Column 1</td>
                        <td>Row 1, Column 2</td>
                        </tr>
                        <tr>
                        <td>Row 2, Column 1</td>
                        <td>Row 2, Column 2</td>
                        </tr>
                        <tr>
                        <td>Row 3, Column 1</td>
                        <td>Row 3, Column 2</td>
                        </tr>
                    </tbody>
                    </table>
                    </div>

                    <button className="btn_main mt-3">Pay Online And Confirm The Appointment</button>
                    <button className="btn_main mt-3">Pay At The Salon And Confirm The Appointment</button>
                    <button className="btn_main mt-3">Back</button>

                </div>
            </div>

        </div>
    </div>
    </>
  );
};
