import React, { useState } from "react";
import styled from "styled-components";

const PlannerModalBackground = styled.div`
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

const PlannerModalContent = styled.div`
  background: #fff;
  width: 320px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  position: relative;
  font-family: "Poppins", sans-serif; 

  h4 {
    font-family: "Poppins", sans-serif; 
  }
`;

const CloseButton = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 20px;
  height: 20px;
  width: 20px;
  color: #FF3040;
`;

const AddToPlannerButton = styled.button`
  background-color: #111;
  color: #fff;
  border: none;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 20px;
  border-radius: 5px;
  font-family: "Poppins", sans-serif; 
`;

const SelectDay = styled.select`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-family: "Poppins", sans-serif; 
`;

function PlannerModal({ isOpen, closeModal, recipe, onAddToPlanner }) {
  const [selectedDay, setSelectedDay] = useState("Monday");

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    isOpen && (
      <PlannerModalBackground>
        <PlannerModalContent>
          <CloseButton onClick={closeModal}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                clipRule="evenodd"
              />
            </svg>
          </CloseButton>
          <h4>Add {recipe.title} to Planner</h4>

          <SelectDay
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
          >
            {daysOfWeek.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </SelectDay>

          <AddToPlannerButton onClick={() => onAddToPlanner(selectedDay)}>
            Add to Planner
          </AddToPlannerButton>
        </PlannerModalContent>
      </PlannerModalBackground>
    )
  );
}

export default PlannerModal;
