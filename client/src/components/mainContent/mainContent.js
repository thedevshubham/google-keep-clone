import { useMutation, useQuery, useSubscription } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import { useNotesContext } from "../../context/notesContext.js/notesContextProvider";
import { ReactComponent as CheckButton } from "../../images/check-circle-svgrepo-com.svg";
import { CREATE_NOTE_MUTATION } from "../../queries/query_creation.graphql";
import { LIST_NOTES } from "../../queries/query_list_notes.graphql";
import { NOTES_SUBSCRIPTION } from "../../queries/query_subscription.graphql";
import InputBox from "../globalComponents/inputBox";
import "./mainContent.scss";

const MainContent = () => {
  const [createNote] = useMutation(CREATE_NOTE_MUTATION);
  const { data } = useQuery(LIST_NOTES);

  const textAreaRef = useRef();
  const inputBoxRef = useRef();
  const [{ isGridView }] = useNotesContext();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [hovered, setHovered] = useState("");
  const [showInputHeaderFooter, setShowInputHeaderFooter] = useState(false);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (data?.notes?.length > 0) {
      setNotes(data?.notes);
    }
  }, [data]);

  // Creating subscription for blogs //
  useSubscription(NOTES_SUBSCRIPTION, {
    onSubscriptionData: ({ subscriptionData }) => {
      // This function will get triggered one a publish event is being initited by the server
      // when new blog is being added
      if (subscriptionData?.data?.noteCreated) {
        // we are updating the state of blogs
        setNotes([...notes, subscriptionData?.data?.noteCreated]);
      }
    },
  });

  useEffect(() => {
    textAreaRef?.current?.focus();
  }, [content]);

  useEffect(() => {
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, []);

  const onClickOutside = (e) => {
    if (inputBoxRef?.current && !inputBoxRef?.current?.contains(e.target)) {
      setShowInputHeaderFooter(false);
    }
  };

  const handleMouseEnter = (item, ind) => {
    setHovered(`${item}${ind}`);
  };

  const handleMouseLeave = () => setHovered("");

  const onCheckBoxCllick = (item, index) => {
    console.log(item, index);
  };

  const onCloseInput = () => {
    setShowInputHeaderFooter(false);
  };

  const onSaveNotes = () => {
    console.log("title", title);
    console.log("content", content);
    createNote({
      variables: { title, content },
      optimisticResponse: {
        __typename: "Mutation",
        createNote: {
          __typename: "Note",
          id: Math.round(Math.random() * -1000000),
          title: title,
          content: content,
        },
      },
    });
    setTitle("");
    setContent("");
    setShowInputHeaderFooter(false);
  };

  const onTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const onValueChange = (e) => {
    setContent(e.target.value);
  };

  const onTextAreaClick = (e) => {
    setShowInputHeaderFooter(true);
  };

  return (
    <main>
      <div className="mainContent">
        <div className="mainContent__inputContainer">
          <InputBox
            content={content}
            title={title}
            textAreaRef={textAreaRef}
            inputBoxRef={inputBoxRef}
            onSaveNotes={onSaveNotes}
            onCloseInput={onCloseInput}
            onTitleChange={onTitleChange}
            onValueChange={onValueChange}
            onTextAreaClick={onTextAreaClick}
            showInputHeaderFooter={showInputHeaderFooter}
          />
        </div>
        <div className="mainContent__cardContainer">
          <div className={`grid-container ${!isGridView && "listView"}`}>
            {notes?.map((item, index) => {
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
                    <h5 className="card-title">{item?.title}</h5>
                    <p className="card-text">{item?.content}</p>
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
