import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import CountdownTimer from "../components/CountdownTimer/CountdownTimer";
import PaymentCard from "../components/PaymentCard/PaymentCard";
import PaymentForm from "../components/PaymentForm/PaymentForm";
import { useBooking } from "../context/BookingContext";
import { useToast } from "../context/ToastContext";
import "../styles/Payment.css";

function Payment() {
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);

  const { confirmBooking } = useBooking();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handlePayment = () => {
    setProcessing(true);

    // Simulated payment processing, then confirm the real booking server-side
    setTimeout(async () => {
      try {
        await confirmBooking();
        navigate("/booking-success");
      } catch (err) {
        const msg =
          err.response?.data?.error || err.message || "Payment failed.";
        showToast(msg, "error");
        navigate("/seat-selection");
      }
    }, 2000);
  };

  return (
    <>
      <Navbar />

      <div className="payment-page">
        <div className="payment-top">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Order Summary
          </button>

          <CountdownTimer />
        </div>

        <div className="payment-content">
          <h1 className="payment-title">Payment</h1>

          <PaymentCard
            cardNumber={cardNumber}
            cardHolder={cardHolder}
            expiry={expiry}
          />

          <PaymentForm
            cardNumber={cardNumber}
            setCardNumber={setCardNumber}
            cardHolder={cardHolder}
            setCardHolder={setCardHolder}
            expiry={expiry}
            setExpiry={setExpiry}
            cvv={cvv}
            setCvv={setCvv}
            processing={processing}
            handlePayment={handlePayment}
          />
        </div>
      </div>
    </>
  );
}

export default Payment;
