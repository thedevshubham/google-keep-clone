import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { SET_SIDE_LINK_DATA } from "../../config/contextConstants";
import { useNotesContext } from "../../context/notesContext.js/notesContextProvider";
import { ReactComponent as ArchiveIcon } from "../../images/archive-svgrepo-com.svg";
import { ReactComponent as NotesIcon } from "../../images/bulb-svgrepo-com.svg";
import { ReactComponent as EditLabelIcon } from "../../images/edit-svgrepo-com.svg";
import { ReactComponent as RemindersIcon } from "../../images/reminder-bell-svgrepo-com.svg";
import { ReactComponent as TrashIcon } from "../../images/trash-svgrepo-com.svg";
import "./sideMenu.scss";

const sideBarList = [
  { type: "notes", name: "Notes", link: "/notes", image: <NotesIcon /> },
  {
    type: "reminders",
    name: "Reminders",
    link: "/reminders",
    image: <RemindersIcon />,
  },
  {
    type: "edit",
    name: "Edit Label",
    link: "/editLabel",
    image: <EditLabelIcon />,
  },
  {
    type: "archive",
    name: "Archive",
    link: "/archive",
    image: <ArchiveIcon />,
  },
  { type: "trash", name: "Trash", link: "/trash", image: <TrashIcon /> },
];

const SideMenu = () => {
  const [{ isGridView, isDrawerClicked, sideLinkData }, dispatch] =
    useNotesContext();

  useEffect(() => {
    handleSideLink();
  }, []);

  const handleSideLink = (link = "", title = "") => {
    let path = window.location.pathname;
    dispatch({
      type: SET_SIDE_LINK_DATA,
      key: "activeLink",
      value: link || window.location.pathname,
    });
    dispatch({
      type: SET_SIDE_LINK_DATA,
      key: "title",
      value: decodeURI(title || window.location.pathname).replace("/", ""),
    });
  };

  return (
    <div className="sideMenu">
      <div className="sideMenu__container">
        {sideBarList.map((item) => {
          return (
            <Link
              to={item.name}
              className="menuItem"
              key={item.link}
              onClick={() => handleSideLink(item.link, item.name)}
            >
              <div
                className={`sideMenu__block ${
                  sideLinkData.activeLink.toLowerCase() ===
                  item.link.toLowerCase()
                    ? "activeLink"
                    : ""
                }`}
              >
                {item.image}
                {!isDrawerClicked && (
                  <span className="sideMenu__text">{item.name}</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SideMenu;
