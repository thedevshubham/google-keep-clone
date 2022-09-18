import React, { useEffect, useRef, useState } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";
import "./inputBox.scss";

const InputBox = () => {
  const textAreaRef = useRef();
  const inputBoxRef = useRef();
  const [value, setValue] = useState("");
  const [showHeaderFooter, setShowHeaderFooter] = useState(false);

  useEffect(() => {
    textAreaRef?.current?.focus();
  }, [value]);

  useEffect(() => {
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
    }
  }, []);

  const handleValueChange = (e) => {
    setValue(e.target.value);
  };

  const handleClick = () => {
    setShowHeaderFooter(true);
  };

  const onClickOutside = (e) => {
    if (inputBoxRef?.current && !inputBoxRef?.current?.contains(e.target)) {
      setShowHeaderFooter(false);
    }
  }

  const onClose = () => {
    setShowHeaderFooter(false);
  }

  return (
    <div className="inputBox" ref={inputBoxRef}>
      {showHeaderFooter && <div className="inputBox__title">Title</div>}
      <div className="inputBox__inputNotes">
        <ReactTextareaAutosize
          className="inputBox__textArea"
          placeholder={"Take a note..."}
          rows={1}
          ref={textAreaRef}
          value={value}
          onChange={handleValueChange}
          onClick={handleClick}
        />
      </div>
      {showHeaderFooter && (
        <div className="inputBox__actionItems">
          <span className="inputBox__action" onClick={onClose}>Close</span>
        </div>
      )}
    </div>
  );
};

export default InputBox;
