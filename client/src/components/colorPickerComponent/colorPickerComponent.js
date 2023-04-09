import React from "react";
import { CompactPicker } from "react-color";
import "../mainContent/mainContent.scss";

const ColorPickerComponent = ({
  item,
  hovered,
  showColorPicker,
  handleColorPickerClose,
  handleColorChangeComplete,
}) => {
  return (
    <>
      {hovered === item?.id && showColorPicker && (
        <div
          className="color-picker-popover"
          onMouseLeave={handleColorPickerClose}
        >
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
