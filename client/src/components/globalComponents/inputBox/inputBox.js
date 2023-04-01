import React from "react";
import ReactTextareaAutosize from "react-textarea-autosize";
import "./inputBox.scss";

const InputBox = ({
  content,
  title,
  textAreaRef,
  inputBoxRef,
  onSaveNotes,
  onCloseInput,
  onTitleChange,
  onValueChange,
  onTextAreaClick,
  showInputHeaderFooter,
}) => {
  return (
    <div className="inputBox" ref={inputBoxRef}>
      {showInputHeaderFooter && (
        <div className="inputBox__title">
          <ReactTextareaAutosize
            className="inputBox__textArea"
            placeholder={"Title"}
            rows={1}
            value={title}
            onChange={onTitleChange}
          />
        </div>
      )}
      <div className="inputBox__inputNotes">
        <ReactTextareaAutosize
          className="inputBox__textArea"
          placeholder={"Take a note..."}
          rows={1}
          ref={textAreaRef}
          value={content}
          onChange={onValueChange}
          onClick={onTextAreaClick}
        />
      </div>
      {showInputHeaderFooter && (
        <div className="inputBox__actionItems">
          <span className="inputBox__action" onClick={onCloseInput}>
            Close
          </span>
          <span className="inputBox__action" onClick={onSaveNotes}>
            Save
          </span>
        </div>
      )}
    </div>
  );
};

export default InputBox;
