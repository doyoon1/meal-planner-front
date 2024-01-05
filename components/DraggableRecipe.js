import React from 'react';
import { useDrag } from 'react-dnd';
import styled from 'styled-components';

const DraggableRecipeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border-radius: 24px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #ccc;
  width: auto;
  padding: 4px 8px;
  margin-bottom: 10px;
`;

const RecipeImage = styled.img`
  width: 20px;
  height: 20px;
  object-fit: cover;
  border-radius: 50%;
  margin-right: 10px;
`;

const RecipeTitle = styled.div`
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const DraggableRecipe = ({ recipe, session }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'RECIPE',
    item: { recipe },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <DraggableRecipeContainer
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move' }}
    >
      <RecipeImage src={recipe.images?.[0]} alt={recipe.title} />
      <RecipeTitle>{recipe.title}</RecipeTitle>
    </DraggableRecipeContainer>
  );
};

export default DraggableRecipe;