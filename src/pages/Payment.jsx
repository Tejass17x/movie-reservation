import Navbar from "../components/Navbar/Navbar";
import CountdownTimer from "../components/CountdownTimer/CountdownTimer";
import PaymentCard from "../components/PaymentCard/PaymentCard";
import "../styles/Payment.css";
import PaymentForm from "../components/PaymentForm/PaymentForm";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Payment() {
    const [cardNumber, setCardNumber] = useState("");
    const [cardHolder, setCardHolder] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(false);
    const handlePayment = () => {
    setProcessing(true);
   setTimeout(() => {

    navigate("/booking-success");

  }, 2000);

};
    return (
        <>
            <Navbar />

            <div className="payment-page">

                <div className="payment-top">

                    <button className="back-btn">
                        ← Order Summary
                    </button>

                    <CountdownTimer />

                </div>
                <div className="payment-content">
                <h1 className="payment-title">
                    Payment
                </h1>
                

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