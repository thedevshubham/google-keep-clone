import { useEffect, useRef } from "react";
import "./dropdown.scss";

const Dropdown = ({
  item,
  showMoreOptionsDropdown,
  onMoreOptionsDropdownClick,
  setShowMoreOptionsDropdown,
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowMoreOptionsDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const dropdownItems = [
    {
      label: "Add label",
      onClick: () => onMoreOptionsDropdownClick("edit", item),
    },
  ];

  return (
    <div className="dropdown" ref={dropdownRef}>
      {showMoreOptionsDropdown &&
        dropdownItems.map((dropdownVal) => (
          <div
            className="dropdown-item"
            key={dropdownVal.label}
            onClick={dropdownVal.onClick}
          >
            {dropdownVal.label}
          </div>
        ))}
    </div>
  );
};

export default Dropdown;
