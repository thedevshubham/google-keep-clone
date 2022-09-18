import React, { useState } from "react";
import InputBox from "../globalComponents/inputBox";
import { ReactComponent as CheckButton } from "../../images/check-circle-svgrepo-com.svg";
import "./mainContent.scss";
import { useNotesContext } from "../../context/notesContext.js/notesContextProvider";
const cardArray = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

const MainContent = () => {
  const [{ isGridView }] = useNotesContext();
  const [hovered, setHovered] = useState("");

  const handleMouseEnter = (item, ind) => {
    setHovered(`${item}${ind}`);
  };

  const handleMouseLeave = () => setHovered("");

  const onCheckBoxCllick = (item, index) => {
    console.log(item, index);
  };

  return (
    <main>
      <div className="mainContent">
        <div className="mainContent__inputContainer">
          <InputBox />
        </div>
        <div className="mainContent__cardContainer">
          <div className={`grid-container ${!isGridView && "listView"}`}>
            {cardArray.map((item, index) => {
              return (
                <div
                  className="grid__item"
                  key={`${item}${index}`}
                  onMouseEnter={() => handleMouseEnter(item, index)}
                  onMouseLeave={() => handleMouseLeave()}
                >
                  {hovered === `${item}${index}` && (
                    <div className="grid__item-action-check">
                      <button
                        className="checkButton"
                        onClick={() => onCheckBoxCllick(item, index)}
                      >
                        <CheckButton />
                      </button>
                    </div>
                  )}
                  <div className="card-body">
                    <h5 className="card-title">
                      Card title that wraps to a new line
                    </h5>
                    <p className="card-text">
                      This is a longer card with supporting text below as a
                      natural lead-in to additional content. This content is a
                      little bit longer.
                    </p>
                    {index ===
                      5 && (
                        <p className="card-text">
                          This is a longer card with supporting text below as a
                          natural lead-in to additional content. This content is
                          a little bit longer.
                        </p>
                      )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainContent;
