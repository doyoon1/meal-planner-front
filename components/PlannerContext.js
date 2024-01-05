import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useSession } from 'next-auth/react';

export const PlannerContext = createContext();

const PlannerContextProvider = (props) => {
  const [planner, setPlanner] = useState({});
  const { data: session } = useSession();

  useEffect(() => {
    fetchPlannerData();
  }, []); 

  const fetchPlannerData = async () => {
    try {
      const response = await axios.get("/api/planner");
      // Merge the fetched data with the initial state
      setPlanner((prevPlanner) => ({ ...prevPlanner, ...response.data }));
    } catch (error) {
      console.error("Error fetching planner data:", error);
    }
  };

  const addRecipeToDay = async (day, meals, recipe) => {
    try {
      const response = await axios.post(
        "/api/planner",
        {
          day,
          meals,
          recipeId: recipe._id,
          userId: session.user._id,
        }
      );
      setPlanner(response.data);
    } catch (error) {
      console.error("Error adding recipe to planner:", error);
    }
  };
  
  const removeRecipeFromDay = async (day, meal, recipeId) => {
    try {
      const response = await axios.delete(
        "/api/planner",
        {
          data: {
            day,
            meal,
            recipeId,
          }
        }
      );
      setPlanner(response.data);
    } catch (error) {
      console.error("Error removing recipe from planner:", error);
    }
  };

  return (
    <PlannerContext.Provider value={{ planner, addRecipeToDay, removeRecipeFromDay, setPlanner, fetchPlannerData }}>
      {props.children}
    </PlannerContext.Provider>
  );
};

export default PlannerContextProvider;