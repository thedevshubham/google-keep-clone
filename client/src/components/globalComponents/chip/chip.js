import React from "react";

const Chip = ({ label }) => {
  const chipStyle = {
    backgroundColor: "#e0e0e0a6",
    color: "#000",
    display: "inline-block",
    borderRadius: "16px",
    padding: "2px 2px",
    margin: "4px",
    fontSize: "10px",
    fontWeight: "500",
    lineHeight: "1.5",
    textAlign: "center",
    minWidth: "40px",
    boxSizing: "border-box",
    cursor: "pointer",
  };

  return <div style={chipStyle}>{label}</div>;
};

export default Chip;
