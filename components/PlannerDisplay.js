import React, { useContext, useEffect } from "react";
import { PlannerContext } from "./PlannerContext";

const PlannerDisplay = () => {
  const { planner, fetchPlannerData } = useContext(PlannerContext);

  useEffect(() => {
    // Fetch planner data when the component mounts
    fetchPlannerData();
  }, [fetchPlannerData]);

  if (!planner || !planner.planner) {
    return <p>Loading...</p>; // Add a loading indicator or message
  }

  return (
    <div>
      <h2>Your Planner</h2>
      {planner.planner.length === 0 ? (
        <p>No planner data available</p>
      ) : (
        <div>
          {planner.planner.map((entry) => (
            <div key={entry.day}>
              <h3>{entry.day}</h3>
              {entry.meals && Object.keys(entry.meals).map((meal) => (
                <div key={meal}>
                  <h4>{meal}</h4>
                  <ul>
                    {entry.meals[meal] && entry.meals[meal].map((recipeId) => (
                      <li key={recipeId}>{/* Display recipe details here */}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlannerDisplay;
