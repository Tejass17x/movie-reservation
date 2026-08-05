import { useContext } from "react";
import { BookingContext } from "../context/BookingContext";
import { useNavigate } from "react-router-dom";
import CountdownTimer from "../components/CountdownTimer/CountdownTimer";
import "../styles/OrderSummary.css";
import Navbar from "../components/Navbar/Navbar";
import poster from "../assets/poster.jpg";

function OrderSummary() {

    const { selectedSeats, movie } = useContext(BookingContext);

    const navigate = useNavigate();

    const subtotal = selectedSeats.length * movie.price;

    const serviceFee = subtotal * 0.05;

    const total = subtotal + serviceFee;

    return (
        <>
            <Navbar />

            <div className="order-summary">
                <p
                    className="edit-link"
                    onClick={() => navigate("/")}
                >
                    ← Edit Seats
                </p>

                <div className="summary-header">

                    <h1>Order Summary</h1>

                    <CountdownTimer />

                </div>

                <div className="summary-card">

                    <div className="movie-info">

                        <img
                            src={poster}
                            alt="Movie Poster"
                            className="movie-poster"
                        />

                        <div className="movie-details">

                            <h2>{movie.title}</h2>

                            <p>{movie.theatre}</p>

                            <p>{movie.date} • {movie.time}</p>

                        </div>

                    </div>

                    <hr />

                    <div className="price-details">

                        <div>
                            <span>Seats</span>
                            <span>{selectedSeats.join(", ")}</span>
                        </div>

                        <div className="summary-row">

                        <span>{selectedSeats.length} × ${movie.price}</span>

                            <span>${subtotal}</span>

                        </div>

                        <div>
                            <span>Service Fee</span>
                            <span>${serviceFee.toFixed(2)}</span>
                        </div>

                        <div className="total-row">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>

                    </div>

                    <button
                        className="payment-btn"
                        onClick={() => navigate("/payment")}
                    >
                        Proceed to Payment →
                    </button>

                </div>

            </div>
        </>
    );

}

export default OrderSummary;