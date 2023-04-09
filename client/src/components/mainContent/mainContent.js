import { useMutation, useQuery, useSubscription } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import { useNotesContext } from "../../context/notesContext.js/notesContextProvider";
import { CREATE_NOTE_MUTATION } from "../../queries/query_creation.graphql";
import { LIST_NOTES } from "../../queries/query_list_notes.graphql";
import { NOTES_SUBSCRIPTION } from "../../queries/query_subscription.graphql";
import CardComponent from "../cardComponent/cardComponent";
import InputBox from "../globalComponents/inputBox";
import "./mainContent.scss";

const MainContent = () => {
  const [createNote] = useMutation(CREATE_NOTE_MUTATION);
  const { data } = useQuery(LIST_NOTES);

  const textAreaRef = useRef();
  const inputBoxRef = useRef();
  const [{ isGridView, selectedNotes }, dispatch] = useNotesContext();

  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showInputHeaderFooter, setShowInputHeaderFooter] = useState(false);

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

  useEffect(() => {
    console.log(selectedNotes, "sel notes here");
  }, [selectedNotes]);

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
              return <CardComponent item={item} index={index} />;
            })}
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainContent;
