const rows = ["A", "B", "C", "D", "E", "F", "G"];

const seatData = [];

rows.forEach((row) => {

  for (let i = 1; i <= 12; i++) {

    let status = "available";

    // Reserved Seats
    if (
      (row === "A" && i === 5) ||
      (row === "B" && i === 3) ||
      (row === "D" && i === 8)
    ) {
      status = "reserved";
    }

    // Blocked Seats
    if (
      (row === "C" && i === 6) ||
      (row === "F" && i === 10)
    ) {
      status = "blocked";
    }

    seatData.push({
      id: `${row}${i}`,
      row,
      number: i,
      status,
    });

  }

});

export default seatData;