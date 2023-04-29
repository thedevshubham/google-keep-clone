import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { SET_SELECTED_NOTES } from "../../config/contextConstants";
import { useNotesContext } from "../../context/notesContext.js/notesContextProvider";
import { ReactComponent as ArchiveIcon } from "../../images/archive-svgrepo-com.svg";
import { ReactComponent as CheckButton } from "../../images/check-circle-svgrepo-com.svg";
import { ReactComponent as ColorIcon } from "../../images/color-svgrepo-com.svg";
import { ReactComponent as ReminderIcon } from "../../images/reminder-bell-svgrepo-com.svg";
import { ReactComponent as PinIcon } from "../../images/pin-svgrepo-com.svg";
import { ReactComponent as TrashIcon } from "../../images/trash-svgrepo-com.svg";
import { ReactComponent as ThreeDotsIcon } from "../../images/three-dots-vertical-svgrepo-com.svg";
import { DELETE_LABEL } from "../../queries/query_delete_label.graphql";
import { UPDATE_NOTE_MUTATION } from "../../queries/query_update_notes.graphql";
import ColorPickerComponent from "../colorPickerComponent/colorPickerComponent";
import AddLabelDropdown from "../globalComponents/addLabelDropdown/addLabelDropdown";
import Chip from "../globalComponents/chip/chip";
import Dropdown from "../globalComponents/dropdown/dropdown";
import "../mainContent/mainContent.scss";
import { DELETE_NOTE } from "../../queries/query_delete_note.gaphql";

const CardComponent = ({
  item,
  index,
  labelsFromQuery,
  handleModalOpen,
  isTrash,
}) => {
  const [updateNote] = useMutation(UPDATE_NOTE_MUTATION);
  const [deleteNote] = useMutation(DELETE_NOTE);
  const [deleteLabel] = useMutation(DELETE_LABEL);

  const [{ selectedNotes }, dispatch] = useNotesContext();

  const [hovered, setHovered] = useState("");
  const [label, setLabel] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showMoreOptionsDropdown, setShowMoreOptionsDropdown] = useState(false);
  const [isLabelDropdownOpen, setIsLabelDropdownOpen] = useState(false);

  const handleSketchPicker = (e) => {
    e.stopPropagation();
    setShowColorPicker(!showColorPicker);
    setShowMoreOptionsDropdown(false);
  };

  const handleColorChangeComplete = (colorObj, item, e) => {
    e.stopPropagation();
    console.log(item, "akjshdkajshdkjhsadkj");
    updateNote({
      variables: {
        id: item.id,
        color: colorObj.hex,
      },
      optimisticResponse: {
        __typename: "Mutation",
        updateNote: {
          __typename: "Note",
          id: item.id,
          color: colorObj.hex,
          content: item.content,
          title: item.title,
          label: item.label.length > 0 ? [...item.label] : [],
          isPinned: item.isPinned,
        },
      },
    });
  };

  const handlePinSelected = (e) => {
    e.stopPropagation();
    updateNote({
      variables: {
        id: item.id,
        isPinned: !item.isPinned,
      },
      optimisticResponse: {
        __typename: "Mutation",
        updateNote: {
          __typename: "Note",
          id: item.id,
          color: item.color,
          content: item.content,
          title: item.title,
          label: item.label,
          isPinned: !item.isPinned,
        },
      },
    });
  };

  const handleCreateNewLabel = (e) => {
    e.stopPropagation();
    const trimmedLabel = label.trim();
    if (!trimmedLabel) {
      return;
    }
    updateNote({
      variables: { id: item.id, label: [trimmedLabel] },
      optimisticResponse: {
        __typename: "Mutation",
        updateNote: {
          __typename: "Note",
          id: item.id,
          color: item.color,
          content: item.content,
          title: item.title,
          isPinned: item.isPinned,
          label:
            item.label.length > 0
              ? [...item.label, trimmedLabel]
              : [trimmedLabel],
        },
      },
    });

    setLabel("");
  };

  const handleMouseEnter = (id) => {
    setHovered(id);
  };

  const handleMouseLeave = () => {
    setHovered("");
  };

  const handleMoreOptions = () => {
    setShowMoreOptionsDropdown(!showMoreOptionsDropdown);
  };

  const onMoreOptionsDropdownClick = (dropdown, item) => {
    setIsLabelDropdownOpen(true);
  };

  const handleLabelChange = (e) => {
    setLabel(e.target.value);
  };

  const handleLabelSelection = (event) => {
    const { value, checked } = event.target;
    console.log(value, checked, "I am here");
    if (!checked) {
      deleteLabel({
        variables: { id: item.id, label: value },
        optimisticResponse: {
          __typename: "Mutation",
          updateNote: {
            __typename: "Note",
            id: item.id,
            label: value,
          },
        },
      });
    } else {
      updateNote({
        variables: { id: item.id, label: [value] },
        optimisticResponse: {
          __typename: "Mutation",
          updateNote: {
            __typename: "Note",
            id: item.id,
            color: item.color,
            content: item.content,
            title: item.title,
            isPinned: item.isPinned,
            label: [value],
          },
        },
      });
    }
  };

  const handleDeleteNotes = (e) => {
    e.stopPropagation();
    deleteNote({
      variables: { id: item.id },
    });
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
    <div
      className={`grid__item ${selectedNotes[item?.id] ? `selected` : ``}`}
      style={{ backgroundColor: item?.color }}
      key={`${item.id}${index}`}
      onMouseEnter={() => handleMouseEnter(item?.id)}
      onMouseLeave={handleMouseLeave}
    >
      {(hovered === item?.id || selectedNotes[item?.id]) && !isTrash && (
        <div className="grid__item-action-check">
          <button className="checkButton" onClick={() => onCheckBoxClick(item)}>
            <CheckButton />
          </button>
        </div>
      )}

      <div className="card-header">
        <h5 className="card-title">{item?.title}</h5>
        <div className="card-chip">
          {item?.label?.map((labelItem) => (
            <Chip label={labelItem} key={labelItem} />
          ))}
        </div>
      </div>

      <div className="card-body" onClick={() => handleModalOpen(item)}>
        <p className="card-text">{item?.content}</p>
      </div>

      {!isTrash && (
        <div className="card-actions">
          <div className="card-action-item">
            <ReminderIcon />
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
            <PinIcon onClick={handlePinSelected} />
          </div>
          <div className="card-action-item">
            <TrashIcon onClick={handleDeleteNotes} />
          </div>
          <div className="card-action-item">
            <ThreeDotsIcon onClick={handleMoreOptions} />
            <Dropdown
              item={item}
              showMoreOptionsDropdown={showMoreOptionsDropdown}
              setShowMoreOptionsDropdown={setShowMoreOptionsDropdown}
              onMoreOptionsDropdownClick={onMoreOptionsDropdownClick}
            />
            <AddLabelDropdown
              isOpen={isLabelDropdownOpen}
              setIsLabelDropdownOpen={setIsLabelDropdownOpen}
              labelsList={labelsFromQuery}
              handleCreateNewLabel={handleCreateNewLabel}
              handleLabelChange={handleLabelChange}
              newLabel={label}
              handleLabelSelection={handleLabelSelection}
              selectedLabels={item.label}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CardComponent;
