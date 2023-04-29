import React from "react";
import Modal from "react-modal";
import "./popup.scss";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    // height: "50%",
    borderRadius: "8px",
    boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.75)",
    padding: "16px",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
};

const Popup = ({ modalIsOpen, setIsOpen, item }) => {
  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Note Modal"
        ariaHideApp={false}
      >
        <div className="modal-header">
          <h3 className="modal-title">{item?.title}</h3>
          <button className="modal-close" onClick={closeModal}>
            &times;
          </button>
        </div>
        <div className="modal-body">{item?.content}</div>
      </Modal>
    </div>
  );
};

export default Popup;
