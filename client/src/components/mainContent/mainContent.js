import { useMutation, useQuery, useSubscription } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import { useNotesContext } from "../../context/notesContext.js/notesContextProvider";
import { CREATE_NOTE_MUTATION } from "../../queries/query_creation.graphql";
import { LIST_NOTES } from "../../queries/query_list_notes.graphql";
import {
  NEW_LABEL_ADDED,
  NOTE_CREATED,
  NOTE_UPDATED,
} from "../../queries/query_subscription.graphql";
import CardComponent from "../cardComponent/cardComponent";
import InputBox from "../globalComponents/inputBox";
import "./mainContent.scss";
import { LIST_LABELS } from "../../queries/query_labels_list.graphql";

const MainContent = () => {
  const [createNote] = useMutation(CREATE_NOTE_MUTATION);
  const { data: notesFromQuery } = useQuery(LIST_NOTES);
  const { data: labelsFromQuery } = useQuery(LIST_LABELS);

  const textAreaRef = useRef();
  const inputBoxRef = useRef();
  const [{ isGridView, selectedNotes }, dispatch] = useNotesContext();

  const [notes, setNotes] = useState([]);
  const [labels, setLabels] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showInputHeaderFooter, setShowInputHeaderFooter] = useState(false);

  useSubscription(NOTE_CREATED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const newNote = subscriptionData.data.noteCreated;
      setNotes((prevNotes) => [...prevNotes, newNote]);
    },
  });

  useSubscription(NOTE_UPDATED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const updatedNote = subscriptionData.data.noteUpdated;
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === updatedNote.id ? updatedNote : note
        )
      );
    },
  });

  useSubscription(NEW_LABEL_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const newLabel = subscriptionData.data.labelAdded;
      setLabels([...newLabel]);
    },
  });

  useEffect(() => {
    if (notesFromQuery?.notes?.length > 0) {
      setNotes(notesFromQuery?.notes);
    }
  }, [notesFromQuery]);

  useEffect(() => {
    if (labelsFromQuery?.getLabels?.length > 0) {
      setLabels(labelsFromQuery?.getLabels);
    }
  }, [labelsFromQuery]);

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

  useEffect(() => {}, [selectedNotes]);

  const onCloseInput = () => {
    setShowInputHeaderFooter(false);
  };

  const onSaveNotes = () => {
    createNote({
      variables: { title, content },
      optimisticResponse: {
        __typename: "Mutation",
        createNote: {
          __typename: "Note",
          id: Math.round(Math.random() * -1000000),
          title: title,
          content: content,
          color: "#ffffff",
          label: [],
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
                <CardComponent
                  item={item}
                  index={index}
                  key={item?.id}
                  labelsFromQuery={labels}
                />
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainContent;
