import React, { useEffect, useState } from "react";
import {
  SET_DRAWER_STATE,
  SET_LIST_VIEW_STATE,
  SET_SELECTED_NOTES,
} from "../../config/contextConstants";
import { useNotesContext } from "../../context/notesContext.js/notesContextProvider";
import { ReactComponent as ArchiveIcon } from "../../images/archive-svgrepo-com.svg";
import { ReactComponent as CloseIcon } from "../../images/close-icon.svg";
import { ReactComponent as GridView } from "../../images/grid-svgrepo-com.svg";
import { ReactComponent as ListView } from "../../images/list-svgrepo-com.svg";
import { ReactComponent as Drawer } from "../../images/menu.svg";
import { ReactComponent as PinIcon } from "../../images/pin-svgrepo-com.svg";
import { ReactComponent as ReminderIcon } from "../../images/reminder-bell-svgrepo-com.svg";
import { ReactComponent as Settings } from "../../images/settings-svgrepo-com.svg";
import SearchBox from "../globalComponents/searchBox";
import "./header.scss";

const Header = () => {
  const [
    { isGridView, isDrawerClicked, sideLinkData, selectedNotes },
    dispatch,
  ] = useNotesContext();
  const [isScroll, setIsScroll] = useState(false);
  const selectedNotesLength = Object.keys(selectedNotes)?.length || 0;

  useEffect(() => {
    window.addEventListener("scroll", handleScrollClassOnHeader);
    return () => {
      window.removeEventListener("scroll", handleScrollClassOnHeader);
    };
  }, []);

  const handleScrollClassOnHeader = () => {
    let activeClass = true;
    if (window.scrollY === 0) {
      activeClass = false;
    }
    setIsScroll(activeClass);
  };

  const toggleView = () => {
    dispatch({ type: SET_LIST_VIEW_STATE, isGridView: !isGridView });
  };

  const onDrawerClick = () => {
    dispatch({ type: SET_DRAWER_STATE, isDrawerClicked: !isDrawerClicked });
  };

  const removeSelectedNotes = () => {
    dispatch({
      type: SET_SELECTED_NOTES,
      selectedNotes: {},
    });
  };

  const renderHeader = () => {
    return (
      <>
        <div className="header__drawer">
          <Drawer className="actionItem drawer" onClick={onDrawerClick} />
          <div className="header__image">
            <img
              src={
                "https://www.gstatic.com/images/branding/product/2x/keep_2020q4_48dp.png"
              }
              alt="keep-logo"
              height={"50px"}
              width={"50px"}
            />
            <div className="header__title">{sideLinkData.title}</div>
          </div>
        </div>
        <div className="header__searchSection">
          <SearchBox placeHolder={"Search"} />
        </div>
        <div className="header__toolsSection">
          <div className="header__imageSection">
            <div
              className="header__toosSection-view toolImg actionItem"
              onClick={toggleView}
            >
              {!isGridView ? <GridView /> : <ListView />}
            </div>
            <div className="header__toosSection-settings toolImg actionItem">
              <Settings />
            </div>
          </div>
          <div className="header__accountSections actionItem">
            <span className="header__account-accordian">S</span>
          </div>
        </div>
      </>
    );
  };

  const renderSelectedHeader = () => {
    return (
      <>
        <div className="header__selectedContainer left">
          <button className="selected-close__button">
            <CloseIcon onClick={removeSelectedNotes} />
          </button>
          <div>{selectedNotesLength} selected</div>
        </div>
        <div className="header__selectedContainer right">
          <div className="header__selected_action">
            <PinIcon />
          </div>
          <div className="header__selected_action">
            <ReminderIcon />
          </div>
          <div className="header__selected_action">
            <ArchiveIcon />
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="header">
      <div className={`header__container ${isScroll && "onScroll"}`}>
        {selectedNotesLength > 0 ? renderSelectedHeader() : renderHeader()}
      </div>
    </div>
  );
};

export default Header;
