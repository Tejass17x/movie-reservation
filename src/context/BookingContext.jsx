import { createContext, useState, useEffect } from "react";

export const BookingContext = createContext();

function BookingProvider({ children }) {

  const [selectedSeats, setSelectedSeats] = useState([]);

  const [timeLeft, setTimeLeft] = useState(600);

  const movie = {
    title: "The Venetian Heist",
    theatre: "Premiere Suite",
    date: "Sat, Aug 1",
    time: "4:45 PM",
    price: 18
  };

  useEffect(() => {

    if (selectedSeats.length === 0) return;

    const timer = setInterval(() => {

      setTimeLeft((prev) => {

        if (prev <= 1) {

          clearInterval(timer);

          setSelectedSeats([]);

          return 600;

        }

        return prev - 1;

      });

    }, 1000);

    return () => clearInterval(timer);

  }, [selectedSeats]);

  return (
    <BookingContext.Provider
      value={{
        selectedSeats,
        setSelectedSeats,
        movie,
        timeLeft
      }}
    >
      {children}
    </BookingContext.Provider>
  );

}

export default BookingProvider;