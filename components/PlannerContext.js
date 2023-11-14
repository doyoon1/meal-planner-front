import React, { createContext, useState, useEffect } from "react";

export const PlannerContext = createContext();

const PlannerContextProvider = (props) => {
  // Load planner data from localStorage or set an empty object
  const initialPlanner = JSON.parse(
    typeof window !== "undefined" ? localStorage.getItem("planner") : null
  ) || {};

  const [planner, setPlanner] = useState(initialPlanner);

  useEffect(() => {
    // Check if localStorage is available before using it
    if (typeof window !== "undefined") {
      // Save planner data to localStorage whenever it changes
      localStorage.setItem("planner", JSON.stringify(planner));
    }
  }, [planner]);

  const addRecipeToDay = (day, recipe) => {
    // Create a copy of the planner to avoid mutating state directly
    const updatedPlanner = { ...planner };

    // Check if the day already exists in the planner
    if (updatedPlanner[day]) {
      // Check if the recipe already exists for the selected day
      const recipeExists = updatedPlanner[day].some((r) => r.title === recipe.title);

      // If the recipe exists, return without adding it again
      if (recipeExists) {
        return;
      }

      // If the recipe doesn't exist, update the recipes array for that day
      updatedPlanner[day].push(recipe);
    } else {
      // If the day doesn't exist, create a new entry with the recipe
      updatedPlanner[day] = [recipe];
    }

    // Update the planner state
    setPlanner(updatedPlanner);
  };

  const removeRecipeFromDay = (day, recipeId) => {
    // Create a copy of the planner to avoid mutating state directly
    const updatedPlanner = { ...planner };
  
    // Check if the day exists in the planner
    if (updatedPlanner[day]) {
      // Remove the recipe with the specified recipeId from the day
      updatedPlanner[day] = updatedPlanner[day].filter((recipe) => recipe._id !== recipeId);
  
      // If there are no recipes left for the day, remove the day
      if (updatedPlanner[day].length === 0) {
        delete updatedPlanner[day];
      }
  
      // Update the planner state
      setPlanner(updatedPlanner);
    }
  };

  return (
    <PlannerContext.Provider value={{ planner, addRecipeToDay, removeRecipeFromDay }}>
      {props.children}
    </PlannerContext.Provider>
  );
};

export default PlannerContextProvider;
