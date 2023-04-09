import "./dropdown.scss";

const Dropdown = ({
  item,
  showMoreOptionsDropdown,
  onMoreOptionsDropdownClick,
  setShowMoreOptionsDropdown,
}) => {
  const dropdownItems = [
    {
      label: "Add label",
      onClick: () => onMoreOptionsDropdownClick("edit", item),
    },
  ];

  const closeDropdown = () => {
    setShowMoreOptionsDropdown(false);
  };

  return (
    <div className="dropdown" onMouseLeave={closeDropdown}>
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
