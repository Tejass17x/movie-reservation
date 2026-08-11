import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import api from "../utils/api.js";

export const BookingContext = createContext();

function BookingProvider({ children }) {
  const [movie, setMovie] = useState(null);
  const [showtime, setShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [heldSeats, setHeldSeats] = useState([]);
  const [bookingId, setBookingId] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [lastBooking, setLastBooking] = useState(null);

  const bookingIdRef = useRef(null);
  bookingIdRef.current = bookingId;

  // Server-synced countdown for the seat hold
  useEffect(() => {
    if (!expiresAt) return;

    const tick = () => {
      const remaining = Math.max(
        0,
        Math.ceil((Date.parse(expiresAt) - Date.now()) / 1000)
      );
      setTimeLeft(remaining);

      if (remaining === 0) {
        clearInterval(interval);
        // Release the hold server-side (best-effort) and reset local state
        if (bookingIdRef.current) {
          api.delete(`/bookings/${bookingIdRef.current}`).catch(() => {});
        }
        setSelectedSeats([]);
        setBookingId(null);
        setExpiresAt(null);
        setTimeLeft(0);
      }
    };

    const interval = setInterval(tick, 1000);
    tick();
    return () => clearInterval(interval);
  }, [expiresAt]);

  const selectMovieAndShowtime = useCallback((selectedMovie, selectedShowtime) => {
    // Release any prior hold before switching to a new showtime
    if (bookingIdRef.current) {
      api.delete(`/bookings/${bookingIdRef.current}`).catch(() => {});
    }
    setMovie(selectedMovie);
    setShowtime(selectedShowtime);
    setSelectedSeats([]);
    setHeldSeats([]);
    setBookingId(null);
    setExpiresAt(null);
    setTimeLeft(0);
    setLastBooking(null);
  }, []);

  const toggleSeat = useCallback((label) => {
    setSelectedSeats((prev) =>
      prev.includes(label)
        ? prev.filter((s) => s !== label)
        : [...prev, label]
    );
  }, []);

  const placeHold = useCallback(async () => {
    if (!showtime || selectedSeats.length === 0) {
      throw new Error("No seats selected.");
    }

    const { data } = await api.post(`/showtimes/${showtime.id}/hold`, {
      seats: selectedSeats,
    });

    setBookingId(data.id);
    setExpiresAt(data.expiresAt);
    setHeldSeats(data.seats);
    return data;
  }, [showtime, selectedSeats]);

  const confirmBooking = useCallback(async () => {
    if (!bookingIdRef.current) {
      throw new Error("No active booking to confirm.");
    }

    const { data } = await api.post(`/bookings/${bookingIdRef.current}/confirm`);
    setLastBooking(data);
    setBookingId(null);
    setExpiresAt(null);
    setTimeLeft(0);
    return data;
  }, []);

  const releaseHold = useCallback(async () => {
    if (bookingIdRef.current) {
      try {
        await api.delete(`/bookings/${bookingIdRef.current}`);
      } catch {
        // Best-effort release; ignore errors
      }
    }
    setBookingId(null);
    setExpiresAt(null);
    setTimeLeft(0);
  }, []);

  const clearBooking = useCallback(() => {
    setMovie(null);
    setShowtime(null);
    setSelectedSeats([]);
    setHeldSeats([]);
    setBookingId(null);
    setExpiresAt(null);
    setTimeLeft(0);
    setLastBooking(null);
  }, []);

  return (
    <BookingContext.Provider
      value={{
        movie,
        showtime,
        selectedSeats,
        heldSeats,
        bookingId,
        expiresAt,
        timeLeft,
        lastBooking,
        selectMovieAndShowtime,
        toggleSeat,
        setSelectedSeats,
        setHeldSeats,
        placeHold,
        confirmBooking,
        releaseHold,
        clearBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};

export default BookingProvider;
