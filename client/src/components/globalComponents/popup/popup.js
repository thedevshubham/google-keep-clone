import React from "react";
import "./popup.scss";

const Popup = ({ isPinned, togglePin }) => {
  return (
    <>
      {isPinned && (
        <div className="pinned-popup">
          <div className="popup-content">
            <span className="close" onClick={togglePin}>
              &times;
            </span>
            <p>This is a pinned popup!</p>
          </div>
        </div>
      )}
      {!isPinned && (
        <div className="popup">
          <div className="popup-content">
            <span className="pin" onClick={togglePin}>
              &#128204;
            </span>
            <p>This is a popup!</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Popup;
