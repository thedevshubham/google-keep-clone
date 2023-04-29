import React, { useEffect, useRef } from "react";
import { CompactPicker } from "react-color";
import "./colorPickerComponent.scss";

const ColorPickerComponent = ({
  item,
  showColorPicker,
  setShowColorPicker,
  handleColorChangeComplete,
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <>
      {showColorPicker && (
        <div className="color-picker-popover" ref={dropdownRef}>
          <CompactPicker
            color={item.color}
            onChange={(color, e) => handleColorChangeComplete(color, item, e)}
          />
        </div>
      )}
    </>
  );
};

export default ColorPickerComponent;
