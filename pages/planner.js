import { useContext, useEffect, useState } from "react";
import { BagContext } from "@/components/BagContext";
import axios from "axios";
import Header from "@/components/Header";
import Center from "@/components/Center";
import styled from "styled-components";
import WeekCalendar from '@/components/Planner';
import React from 'react';
import { useDrop } from 'react-dnd';
import DraggableRecipe from '@/components/DraggableRecipe';

const RecipeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  user-select: none;
`;

export default function PlannerPage() {
  const { bagRecipes } = useContext(BagContext);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    if (bagRecipes.length === 0) {
      // No need to fetch recipes if the bag is empty
      return;
    }

    axios
      .post('/api/bag', { ids: bagRecipes })
      .then(response => {
        console.log('Fetched recipes:', response.data);
        setRecipes(response.data);
      })
      .catch(error => {
        console.error('Error fetching recipes:', error);
        setRecipes([]); // Handle the error by setting recipes to an empty array
      });
  }, [bagRecipes]);

  const [, drop] = useDrop({
    accept: 'RECIPE',
    drop: (item, monitor) => {
      // Handle the drop event, e.g., update the planner state
      const { recipe } = item;
      console.log(`Dropped recipe ${recipe.title} into planner!`);
    },
  });

  return (
    <>
      <Header />
      <Center>
        <h2>My Planner</h2>
        {recipes.length > 0 ? (
          <div>
            <h3>Recipes in the Bag:</h3>
            <RecipeContainer ref={drop}>
                {bagRecipes.map(recipeId => {
                const recipe = recipes.find(r => r._id === recipeId);
                return recipe ? (
                    <DraggableRecipe key={recipe._id} recipe={recipe} />
                ) : null;
                })}
            </RecipeContainer>
          </div>
        ) : (
          <div>Your bag is empty.</div>
        )}
        <WeekCalendar />
        </Center>
    </>
  );
}
