import { useMutation, useQuery, useSubscription } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import { useNotesContext } from "../../context/notesContext.js/notesContextProvider";
import { CREATE_NOTE_MUTATION } from "../../queries/query_creation.graphql";
import { LIST_NOTES } from "../../queries/query_list_notes.graphql";
import {
  NEW_LABEL_ADDED,
  NOTE_CREATED,
  NOTE_DELETED,
  NOTE_UPDATED,
  TRASH_NOTE_UPDATED,
} from "../../queries/query_subscription.graphql";
import CardComponent from "../cardComponent/cardComponent";
import InputBox from "../globalComponents/inputBox";
import "./mainContent.scss";
import { LIST_LABELS } from "../../queries/query_labels_list.graphql";
import { SET_NOTES, SET_TRASH_NOTES } from "../../config/contextConstants";
import Popup from "../globalComponents/popup/popup";
import { LIST_TRASH_NOTES } from "../../queries/query_list_trash_notes.graphql";

const MainContent = () => {
  const [createNote] = useMutation(CREATE_NOTE_MUTATION);
  const { data: notesFromQuery } = useQuery(LIST_NOTES);
  const { data: labelsFromQuery } = useQuery(LIST_LABELS);
  const { data: trashNotesFromQuery } = useQuery(LIST_TRASH_NOTES);

  const textAreaRef = useRef();
  const inputBoxRef = useRef();
  const [{ isGridView, selectedNotes, notes, trashNotes }, dispatch] =
    useNotesContext();

  const [labels, setLabels] = useState([]);
  const [title, setTitle] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [clickedItem, setClickedItem] = useState("");
  const [showInputHeaderFooter, setShowInputHeaderFooter] = useState(false);

  useSubscription(NOTE_CREATED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const newNote = subscriptionData.data.noteCreated;
      let newNotes = [...notes, newNote];
      console.log(notes, "existing notes");
      console.log(newNote, "new notes");
      console.log(newNotes, "newNotes");
      dispatch({ type: SET_NOTES, notes: newNotes });
    },
  });

  useSubscription(NOTE_UPDATED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const updatedNote = subscriptionData.data.noteUpdated;
      console.log(updatedNote, "askjhdkashflkshflksh");
      let notesCopy = [...notes];
      let isUpdated = false;
      console.log(updatedNote, "jjjjj");
      for (let i = 0; i < notesCopy.length; i++) {
        if (notesCopy[i].id === updatedNote.id) {
          notesCopy[i] = updatedNote;
          isUpdated = true;
          return;
        }
      }

      if (!isUpdated) {
        notesCopy.push(updatedNote);
      }

      dispatch({ type: SET_NOTES, notes: notesCopy });
    },
  });

  useSubscription(NOTE_DELETED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const newNotes = subscriptionData.data.noteDeleted;
      dispatch({ type: SET_NOTES, notes: newNotes });
    },
  });

  useSubscription(NEW_LABEL_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const newLabel = subscriptionData.data.labelAdded;
      setLabels([...newLabel]);
    },
  });

  useSubscription(TRASH_NOTE_UPDATED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const trashNotesUpdated = subscriptionData.data.trashUpdated;
      dispatch({ type: SET_TRASH_NOTES, trashNotes: trashNotesUpdated });
    },
  });

  useEffect(() => {
    dispatch({
      type: SET_TRASH_NOTES,
      trashNotes: trashNotesFromQuery?.trashNotes || [],
    });
  }, [trashNotesFromQuery]);

  useEffect(() => {
    if (notesFromQuery?.notes?.length > 0) {
      dispatch({ type: SET_NOTES, notes: notesFromQuery?.notes });
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
          isPinned: false,
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

  const handleModalOpen = (item) => {
    setClickedItem(item);
    setIsOpen(true);
  };

  const showTrashItems = () => {
    return trashNotes?.length > 0 ? (
      <div className={`pinned__items ${!isGridView && "listView"}`}>
        <div className={`grid-container ${!isGridView && "listView"}`}>
          {trashNotes.map((note, index) => (
            <CardComponent
              index={index}
              key={note.id}
              item={note}
              labelsFromQuery={labels}
              handleModalOpen={handleModalOpen}
              isTrash={true}
            />
          ))}
        </div>
      </div>
    ) : null;
  };

  const showNormalItems = () => {
    return (
      <>
        <div className={`pinned__items ${!isGridView && "listView"}`}>
          {notes?.some((note) => note.isPinned) && (
            <div class="pinned__heading">Pinned</div>
          )}
          <div className={`grid-container ${!isGridView && "listView"}`}>
            {notes?.map((item, index) => {
              return item.isPinned ? (
                <CardComponent
                  item={item}
                  index={index}
                  key={item?.id}
                  labelsFromQuery={labels}
                  handleModalOpen={handleModalOpen}
                />
              ) : null;
            })}
          </div>
        </div>
        <div className={`unpinned__items ${!isGridView && "listView"}`}>
          {notes?.some((note) => note.isPinned) && (
            <div class="unpinned__heading">Others</div>
          )}
          <div className={`grid-container ${!isGridView && "listView"}`}>
            {notes?.map((item, index) => {
              return !item.isPinned ? (
                <CardComponent
                  item={item}
                  index={index}
                  key={item?.id}
                  labelsFromQuery={labels}
                  handleModalOpen={handleModalOpen}
                />
              ) : null;
            })}
          </div>
        </div>
      </>
    );
  };

  return (
    <main>
      <div className="mainContent">
        <div className="mainContent__inputContainer">
          {window.location.pathname !== "/Trash" && (
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
          )}
        </div>
        <div className="mainContent__cardContainer">
          {window.location.pathname === "/Trash"
            ? showTrashItems()
            : showNormalItems()}
          <Popup
            modalIsOpen={modalIsOpen}
            setIsOpen={setIsOpen}
            item={clickedItem}
          />
        </div>
      </div>
    </main>
  );
};

export default MainContent;
