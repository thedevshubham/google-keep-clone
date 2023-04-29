import React, { useEffect, useState } from "react";
import {
  SET_DRAWER_STATE,
  SET_LIST_VIEW_STATE,
  SET_NOTES,
  SET_SELECTED_NOTES,
  SET_TRASH_NOTES,
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
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { SEARCH_NOTES } from "../../queries/query_search_notes.graphql";
import { LIST_NOTES } from "../../queries/query_list_notes.graphql";
import { PIN_NOTES } from "../../queries/query_pin_notes.graphql";
import { LIST_TRASH_NOTES } from "../../queries/query_list_trash_notes.graphql";

const Header = () => {
  const [
    { isGridView, isDrawerClicked, sideLinkData, selectedNotes },
    dispatch,
  ] = useNotesContext();
  const [searchValue, setSearchValue] = useState("");
  const [isScroll, setIsScroll] = useState(false);
  const [pinNotes] = useMutation(PIN_NOTES);
  const { data: notesFromQuery } = useQuery(LIST_NOTES);
  const { data: trashNotesFromQuery } = useQuery(LIST_TRASH_NOTES);
  const [getNotes, { data }] = useLazyQuery(SEARCH_NOTES);
  const selectedNotesLength = Object.keys(selectedNotes)?.length || 0;

  useEffect(() => {
    window.addEventListener("scroll", handleScrollClassOnHeader);
    return () => {
      window.removeEventListener("scroll", handleScrollClassOnHeader);
    };
  }, []);

  useEffect(() => {
    let debounce;
    if (searchValue) {
      debounce = setTimeout(() => {
        getNotes({
          variables: {
            term: searchValue,
            isTrash: window.location.pathname === "/Trash",
          },
        });
      }, 500);
    }

    return () => {
      if (debounce) {
        clearTimeout(debounce);
      }
    };
  }, [searchValue, getNotes]);

  useEffect(() => {
    if (data) {
      if (window.location.pathname === "/Trash") {
        dispatch({ type: SET_TRASH_NOTES, trashNotes: data.searchNotes });
      } else {
        dispatch({ type: SET_NOTES, notes: data.searchNotes });
      }
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (!searchValue) {
      if (notesFromQuery?.notes?.length > 0) {
        dispatch({ type: SET_NOTES, notes: notesFromQuery?.notes });
      }
      if (trashNotesFromQuery?.trashNotes?.length > 0) {
        dispatch({
          type: SET_TRASH_NOTES,
          trashNotes: trashNotesFromQuery?.trashNotes,
        });
      }
    }
  }, [searchValue]);

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

  const onSearchClick = () => {};

  const onCloseClick = () => {
    setSearchValue("");
  };

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const handlePinNotes = () => {
    let ids = Object.keys(selectedNotes);
    pinNotes({
      variables: { id: ids },
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
          <SearchBox
            placeHolder={"Search"}
            onSearchClick={onSearchClick}
            onCloseClick={onCloseClick}
            handleSearch={handleSearch}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
        </div>
        <div className="header__toolsSection">
          <div className="header__imageSection">
            <div
              className="header__toosSection-view toolImg actionItem"
              onClick={toggleView}
            >
              {!isGridView ? <GridView /> : <ListView />}
            </div>
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
            <PinIcon onClick={handlePinNotes} />
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
