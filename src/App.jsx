import { Routes, Route } from "react-router-dom";

import SeatSelection from "./pages/SeatSelection";
import OrderSummary from "./pages/OrderSummary";
import Payment from "./pages/Payment";
import BookingSuccess from "./pages/BookingSuccess";
import MyBookings from "./pages/MyBookings";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import BookingHistory from "./pages/BookingHistory";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/seat-selection" element={<SeatSelection />} />
      <Route path="/order-summary" element={<OrderSummary />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/booking-success" element={<BookingSuccess />} />
      <Route path="/my-bookings" element={<MyBookings />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;
