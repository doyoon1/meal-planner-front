import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useContext } from "react";
import { PlannerContext } from "./PlannerContext";

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
  color: #ff3040;
`;

const AddToPlannerButton = styled.button`
  background-color: #111;
  color: #fff;
  border: none;
  padding: 6px 18px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 20px;
  border-radius: 2px;
  font-family: "Poppins", sans-serif;
  transition: all .4s;

  &:hover {
    border-radius: 24px;
  }
`;

const SelectDay = styled.select`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-family: "Poppins", sans-serif;
`;

const CheckboxContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const CheckboxInput = styled.input`
  margin-right: 8px;
`;

const PlannerModal = ({ recipe, isOpen, closeModal }) => {
  const { addRecipeToDay } = useContext(PlannerContext);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedDay, setSelectedDay] = useState("Monday"); // Initialize with a default day
  const [selectedMeals, setSelectedMeals] = useState(["Breakfast"]); // Initialize with a default meal

  useEffect(() => {
    // Update selectedRecipe when the recipe prop changes
    setSelectedRecipe(recipe);
  }, [recipe]);

  const handleDayChange = (day) => {
    setSelectedDay(day);
  };

  const handleMealChange = (meal) => {
    // Toggle the selected meal
    setSelectedMeals((prevMeals) => {
      if (prevMeals.includes(meal)) {
        // If the meal is already selected, remove it
        return prevMeals.filter((selectedMeal) => selectedMeal !== meal);
      } else {
        // If the meal is not selected, add it
        return [...prevMeals, meal];
      }
    });
  };

  const handleAddToPlanner = () => {
    if (selectedRecipe) {
      addRecipeToDay(selectedDay, selectedMeals, selectedRecipe);
      console.log(localStorage.getItem("planner")); // Log the updated localStorage
      closeModal();
    }
  };

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
            onChange={(e) => handleDayChange(e.target.value)}
          >
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </SelectDay>

          <CheckboxContainer>
            <CheckboxLabel>
              <CheckboxInput
                type="checkbox"
                value="Breakfast"
                checked={selectedMeals.includes("Breakfast")}
                onChange={() => handleMealChange("Breakfast")}
              />
              Breakfast
            </CheckboxLabel>

            <CheckboxLabel>
              <CheckboxInput
                type="checkbox"
                value="Lunch"
                checked={selectedMeals.includes("Lunch")}
                onChange={() => handleMealChange("Lunch")}
              />
              Lunch
            </CheckboxLabel>

            <CheckboxLabel>
              <CheckboxInput
                type="checkbox"
                value="Dinner"
                checked={selectedMeals.includes("Dinner")}
                onChange={() => handleMealChange("Dinner")}
              />
              Dinner
            </CheckboxLabel>

            <CheckboxLabel>
              <CheckboxInput
                type="checkbox"
                value="Other"
                checked={selectedMeals.includes("Other")}
                onChange={() => handleMealChange("Other")}
              />
              Other
            </CheckboxLabel>
          </CheckboxContainer>

          <AddToPlannerButton onClick={handleAddToPlanner}>
            Add to Planner
          </AddToPlannerButton>
        </PlannerModalContent>
      </PlannerModalBackground>
    )
  );
}

export default PlannerModal;