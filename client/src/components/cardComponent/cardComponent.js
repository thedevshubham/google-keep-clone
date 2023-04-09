import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { SET_SELECTED_NOTES } from "../../config/contextConstants";
import { useNotesContext } from "../../context/notesContext.js/notesContextProvider";
import { ReactComponent as ArchiveIcon } from "../../images/archive-svgrepo-com.svg";
import { ReactComponent as CheckButton } from "../../images/check-circle-svgrepo-com.svg";
import { ReactComponent as ColorIcon } from "../../images/color-svgrepo-com.svg";
import { ReactComponent as ReminderIcon } from "../../images/reminder-bell-svgrepo-com.svg";
import { ReactComponent as ThreeDotsIcon } from "../../images/three-dots-vertical-svgrepo-com.svg";
import { UPDATE_NOTE_MUTATION } from "../../queries/query_update_notes.graphql";
import ColorPickerComponent from "../colorPickerComponent/colorPickerComponent";
import "../mainContent/mainContent.scss";
import Chip from "../globalComponents/chip/chip";
import Dropdown from "../globalComponents/dropdown/dropdown";

const CardComponent = ({ item, index }) => {
  const [updateNote] = useMutation(UPDATE_NOTE_MUTATION);

  const [{ selectedNotes }, dispatch] = useNotesContext();

  const [hovered, setHovered] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showMoreOptionsDropdown, setShowMoreOptionsDropdown] = useState(false);

  const handleSketchPicker = () => {
    setShowColorPicker(!showColorPicker);
    setShowMoreOptionsDropdown(false);
  };

  const handleColorChangeComplete = (colorObj, item) => {
    updateNote({
      variables: { id: item.id, color: colorObj.hex },
      optimisticResponse: {
        __typename: "Mutation",
        updateNote: {
          __typename: "Note",
          id: item.id,
          color: colorObj.hex,
        },
      },
    });
  };

  const handleMouseEnter = (id) => {
    setHovered(id);
  };

  const handleMouseLeave = () => {
    setHovered("");
    setShowColorPicker(false);
  };

  const handleMoreOptions = () => {
    setShowMoreOptionsDropdown(!showMoreOptionsDropdown);
    setShowColorPicker(false);
  };

  const onMoreOptionsDropdownClick = (dropdown, item) => {
    console.log(dropdown, item);
  };

  const onCheckBoxClick = (item) => {
    if (selectedNotes[item?.id]) {
      const selectedNotesCopy = { ...selectedNotes };
      delete selectedNotesCopy[item?.id];
      dispatch({ type: SET_SELECTED_NOTES, selectedNotes: selectedNotesCopy });
    } else {
      const notes = { ...selectedNotes, [item?.id]: item };
      dispatch({
        type: SET_SELECTED_NOTES,
        selectedNotes: notes,
      });
    }
  };

  return (
    <>
      <div
        className={`grid__item ${selectedNotes[item?.id] ? `selected` : ``}`}
        style={{ backgroundColor: item?.color }}
        key={`${item}${index}`}
        onMouseEnter={() => handleMouseEnter(item?.id)}
        onMouseLeave={handleMouseLeave}
      >
        {(hovered === item?.id || selectedNotes[item?.id]) && (
          <div className="grid__item-action-check">
            <button
              className="checkButton"
              onClick={() => onCheckBoxClick(item)}
            >
              <CheckButton />
            </button>
          </div>
        )}

        <div className="card-body">
          <h5 className="card-title">{item?.title}</h5>
          <p className="card-text">{item?.content}</p>
        </div>

        <div className="card-chip">
          <Chip label={"Demo"} />
          <Chip label={"Demo"} />
          <Chip label={"Demo"} />
        </div>

        <div className="card-actions">
          <div className="card-action-item">
            <ReminderIcon />
          </div>
          <div className="card-action-item">
            <ArchiveIcon />
          </div>
          <div className="card-action-item">
            <ColorIcon onClick={handleSketchPicker} />
            <ColorPickerComponent
              item={item}
              showColorPicker={showColorPicker}
              setShowColorPicker={setShowColorPicker}
              handleColorChangeComplete={handleColorChangeComplete}
            />
          </div>
          <div className="card-action-item">
            <ThreeDotsIcon onClick={handleMoreOptions} />
            <Dropdown
              item={item}
              showMoreOptionsDropdown={showMoreOptionsDropdown}
              setShowMoreOptionsDropdown={setShowMoreOptionsDropdown}
              onMoreOptionsDropdownClick={onMoreOptionsDropdownClick}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CardComponent;
