import "./PaymentForm.css";
import { useContext } from "react";
import { BookingContext } from "../../context/BookingContext";

function PaymentForm({
  cardNumber,
  setCardNumber,

  cardHolder,
  setCardHolder,

  expiry,
  setExpiry,

  cvv,
  setCvv,

  processing,
  handlePayment
}) {

  const { selectedSeats, movie } =
    useContext(BookingContext);

  const subtotal = selectedSeats.length * movie.price;

  const serviceFee = subtotal * 0.05;

  const total = subtotal + serviceFee;

  return (

    <div className="payment-form">

      {/* Card Number */}

      <div className="input-group">

        <label>CARD NUMBER</label>

        <input
          type="text"
          placeholder="1234 5678 9012 3456"

          value={cardNumber}

          onChange={(e) => {

            let value = e.target.value
              .replace(/\D/g, "")
              .slice(0, 16);
          
            value = value.replace(/(.{4})/g, "$1 ").trim();
          
            setCardNumber(value);
          
          }}
        />

      </div>

      {/* Card Holder */}

      <div className="input-group">

        <label>CARD HOLDER NAME</label>

        <input
          type="text"
          placeholder="Alex Rivera"

          value={cardHolder}

          onChange={(e)=>{

            setCardHolder(
            e.target.value.toUpperCase()
            );
            
            }}
        />

      </div>

      {/* Expiry + CVV */}

      <div className="row">

        <div className="input-group">

          <label>EXPIRY (MM/YY)</label>

          <input
            type="text"
            placeholder="08/27"

            value={expiry}

            onChange={(e)=>{

              let value=e.target.value
                  .replace(/\D/g,"")
                  .slice(0,4);
          
              if(value.length>2){
          
                  value=value.slice(0,2)+"/"+value.slice(2);
          
              }
          
              setExpiry(value);
          
          }}
          />

        </div>

        <div className="input-group">

          <label>CVV</label>

          <input
            type="password"
            placeholder="•••"

            value={cvv}

            onChange={(e)=>{

              setCvv(
              
              e.target.value
              .replace(/\D/g,"")
              .slice(0,3)
              
              );
              
              }}
          />

        </div>

      </div>

      {/* Secure Payment */}

      <div className="payment-security">

        <p className="security-title">
          🔒 Secure Payment
        </p>

        <p className="security-text">
          Your payment information is encrypted and
          securely processed. This is a demo
          application, so no real payment will be charged.
        </p>

      </div>

      {/* Pay Button */}

      <button
  className="pay-btn"
  onClick={handlePayment}
  disabled={processing}
>

  {processing
    ? "⏳ Processing Payment..."
    : `Pay $${total.toFixed(2)} & Confirm →`
  }

</button>
    </div>

  );

}

export default PaymentForm;