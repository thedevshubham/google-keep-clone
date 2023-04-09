import React from "react";
import { CompactPicker } from "react-color";
import "./colorPickerComponent.scss";

const ColorPickerComponent = ({
  item,
  showColorPicker,
  setShowColorPicker,
  handleColorChangeComplete,
}) => {
  const closeColorPicker = () => {
    setShowColorPicker(false);
  };
  return (
    <>
      {showColorPicker && (
        <div className="color-picker-popover" onMouseLeave={closeColorPicker}>
          <CompactPicker
            color={item.color}
            onChange={(color) => handleColorChangeComplete(color, item)}
          />
        </div>
      )}
    </>
  );
};

export default ColorPickerComponent;
