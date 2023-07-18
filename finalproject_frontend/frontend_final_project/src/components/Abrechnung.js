import React, { useState } from 'react';
import { useLocation } from "react-router-dom";

const Abrechnung = () => {
  const [selectedPaymentOption, setSelectedPaymentOption] = useState('');
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const reservationId = searchParams.get("reservationId");
  const carId = searchParams.get("carId");
  const price = searchParams.get("price");
  const image =  searchParams.get("image");
  const handlePaymentOptionClick = (option) => {
    setSelectedPaymentOption(option);
  };

  const handlePaymentSubmit = () => {
    // Handle the payment submission logic
  };

  return (
    <div>
      <h1>Payment Page</h1>

      <div>
     
      <p>Reservation ID: {reservationId}</p>
      <img src={image} alt="Car Image" />
      <p>Car ID: {carId}</p>
      <p>Price: {price} {'\u20AC'}</p>
      {/* Other payment-related components */}
    </div>
      <div style={{ display: 'flex' }}>
        <div
          style={{
            flex: '1',
            border: selectedPaymentOption === 'credit_card' ? '2px solid green' : 'none',
          }}
        >
          <div>
            <img
              src="https://c8.alamy.com/comp/2B28569/white-bank-credit-card-template-or-mock-up-on-white-background-plastic-credit-card-2B28569.jpg"
              alt="Credit Card"
              onClick={() => handlePaymentOptionClick('credit_card')}
            />
          </div>
          <form style={{ pointerEvents: selectedPaymentOption === 'credit_card' ? 'auto' : 'none' }}>
            {/* Add your form fields and inputs for credit card payment */}
            {/* For example: */}
            <label>
              Card Number:
              <input type="text" name="cardNumber" />
            </label>
            <label>
              Expiration Date:
              <input type="text" name="expirationDate" />
            </label>
            <label>
              CVV:
              <input type="text" name="cvv" />
            </label>
          </form>
        </div>
        <div
          style={{
            flex: '1',
            border: selectedPaymentOption === 'bank_transfer' ? '2px solid green' : 'none',
          }}
        >
          <div>
            <img
              src="https://nuvei.com/wp-content/uploads/2021/06/regular-bank-transfer.png"
              alt="Bank Transfer"
              onClick={() => handlePaymentOptionClick('bank_transfer')}
            />
          </div>
          <form style={{ pointerEvents: selectedPaymentOption === 'bank_transfer' ? 'auto' : 'none' }}>
            {/* Add your form fields and inputs for bank transfer payment */}
            {/* For example: */}
            <label>
              Bank Account Number:
              <input type="text" name="bankAccountNumber" />
            </label>
            <label>
              Bank Code:
              <input type="text" name="bankCode" />
            </label>
            <label>
              Account Holder Name:
              <input type="text" name="accountHolderName" />
            </label>
          </form>
        </div>
        <div
          style={{
            flex: '1',
            border: selectedPaymentOption === 'paypal' ? '2px solid green' : 'none',
          }}
        >
          <div>
            <img
              src="https://www.mygermanfinances.de/wp-content/uploads/2018/06/PayPal-Account.jpg"
              alt="PayPal"
              onClick={() => handlePaymentOptionClick('paypal')}
            />
          </div>
          <form style={{ pointerEvents: selectedPaymentOption === 'paypal' ? 'auto' : 'none' }}>
            {/* Add your form fields and inputs for PayPal payment */}
            {/* For example: */}
            <label>
              PayPal Email:
              <input type="email" name="paypalEmail" />
            </label>
            <label>
              PayPal Password:
              <input type="password" name="paypalPassword" />
            </label>
          </form>
        </div>
      </div>
      <button onClick={handlePaymentSubmit}>Submit Payment</button>
    </div>
  );
};

export default Abrechnung;
