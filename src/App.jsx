import { Routes, Route } from "react-router-dom";

import SeatSelection from "./pages/SeatSelection";
import OrderSummary from "./pages/OrderSummary";
import Payment from "./pages/Payment";
import BookingSuccess from "./pages/BookingSuccess";
import MyBookings from "./pages/MyBookings";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SeatSelection />} />
      <Route path="/order-summary" element={<OrderSummary />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/booking-success" element={<BookingSuccess />} />
      <Route path="/my-bookings" element={<MyBookings />} />
    </Routes>
  );
}

export default App;