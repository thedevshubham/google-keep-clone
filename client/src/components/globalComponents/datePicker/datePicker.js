import React, { useEffect, useRef } from "react";
import DateTimePicker from "react-datetime-picker";

import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";

const DatePicker = ({ dateTimeChange, dateTimeVal, setIsOpenDatePicker }) => {
  const dateRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dateRef.current && !dateRef.current.contains(event.target)) {
        setIsOpenDatePicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dateRef]);

  return (
    <div ref={dateRef}>
      <DateTimePicker onChange={dateTimeChange} value={dateTimeVal} />
    </div>
  );
};

export default DatePicker;
