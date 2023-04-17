import React, { useState } from "react";
import { ReactComponent as SearchIcon } from "../../../images/search-icon.svg";
import { ReactComponent as CloseIcon } from "../../../images/close-icon.svg";
import "./searchBox.scss";

const SearchBox = ({ placeHolder }) => {
  const [searchValue, setSearchValue] = useState("");

  const onSearchClick = () => {};

  const onCloseClick = () => {};

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <div className="searchBox__container">
      <div className="searchBox__searchButton">
        <button className="searchBox__button" onClick={onSearchClick}>
          <SearchIcon />
        </button>
      </div>
      <div className="searchBox__input">
        <input
          type="text"
          id="searchInput"
          onChange={handleSearch}
          value={searchValue}
          placeholder={placeHolder}
        />
      </div>
      <div className="searchBox__close">
        <button className="searchBox__button" onClick={onCloseClick}>
          <CloseIcon />
        </button>
      </div>
    </div>
  );
};

export default SearchBox;
