function SeatLegend() {
  const itemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  };

  const boxStyle = (color) => ({
    width: "18px",
    height: "18px",
    backgroundColor: color,
    borderRadius: "4px"
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "30px",
        marginTop: "30px",
        marginBottom: "30px"
      }}
    >
      <div style={itemStyle}>
        <div style={boxStyle("#515168")} />
        <span>Available</span>
      </div>

      <div style={itemStyle}>
        <div style={boxStyle("#D4A017")} />
        <span>Selected</span>
      </div>

      <div style={itemStyle}>
        <div style={boxStyle("#8a5a1e")} />
        <span>Held</span>
      </div>

      <div style={itemStyle}>
        <div style={boxStyle("#1b1b24")} />
        <span>Reserved</span>
      </div>
    </div>
  );
}

export default SeatLegend;
