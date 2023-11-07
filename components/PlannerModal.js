import React from "react";
import styled from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  width: 400px; /* Adjust the width as needed */
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const DaySelectorModal = ({ isOpen, onClose, onDaySelected }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div>
      <ModalOverlay onClick={onClose} />
      <ModalContainer>
        {/* Your modal content here */}
        <h2>Choose a day of the week:</h2>
        {/* Add your day selection UI components here */}
        <button onClick={() => onDaySelected("Monday")}>Monday</button>
        <button onClick={() => onDaySelected("Tuesday")}>Tuesday</button>
        {/* Add more day buttons as needed */}
        <button onClick={onClose}>Close</button>
      </ModalContainer>
    </div>
  );
};

export default DaySelectorModal;
