import React, { useEffect, useRef } from "react";
import "./addLabelDropdown.scss";

function AddLabelDropdown({
  isOpen,
  handleCreateNewLabel,
  handleLabelChange,
  newLabel,
  labelsList,
  setIsLabelDropdownOpen,
  handleLabelSelection,
  selectedLabels,
}) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsLabelDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="google-keep-dropdown" ref={dropdownRef}>
      {isOpen && (
        <div className="dropdown-menu">
          <div className="notes-list">
            {labelsList.map((label) => {
              return (
                <label htmlFor={label} className="note-item" key={label}>
                  <input
                    type="checkbox"
                    id={label}
                    value={label}
                    checked={selectedLabels.includes(label)}
                    onChange={handleLabelSelection}
                  />
                  {label}
                </label>
              );
            })}
          </div>
          <div className="create-label-container">
            <input
              type="text"
              id="text"
              className="create-label-input"
              placeholder="create new label..."
              value={newLabel}
              onChange={handleLabelChange}
            />
            <button
              className="create-label-button"
              onClick={handleCreateNewLabel}
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddLabelDropdown;
