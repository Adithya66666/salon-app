import React from 'react';
import StripeCheckout from 'react-stripe-checkout';

const PaymentForm = () => {
  const handleToken = (token) => {
    // Send the token to your server to complete the payment
    console.log(token);
  };

  return (
    <StripeCheckout
      stripeKey="your_stripe_publishable_key"
      token={handleToken}
      name="Demo Payment"
      amount={1000}
      currency="USD"
    />
  );
};

export default PaymentForm;
