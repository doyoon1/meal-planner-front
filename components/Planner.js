import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { useDrop } from 'react-dnd';
import { useDragLayer } from 'react-dnd';
import { PlannerContext } from './PlannerContext';

const Bg = styled.div`
  margin-top: 40px;
  border: 1px solid #444;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
`;

const PlannerContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 4fr;
  &:nth-child(even) {
    background-color: #ccc;
  }
  &:nth-child(odd) {
    background-color: #FFF;
  }
`;

const DayContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 10px;
  background-color: inherit;
  border-right: 1px solid #444;
`;

const ContentContainer = styled.div`
  text-align: left;
  font-size: 12px;
  padding: 4px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
`;

const LabelContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 4fr;
  text-align: center;
`;

const DayLabel = styled.div`
  font-weight: bold;
  background-color: #FFF;
  color: #222;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1px solid #444;
  border-bottom: 1px solid #444;
`;

const Label = styled.div`
  font-weight: bold;
  width: 100%;
  color: #fff;
`;

const MealLabel = styled.div`
  display: flex;
  font-weight: bold;
  justify-content: space-around;
  height: 32px;
  text-align: left;
  justify-content: center;
  align-items: center;
  background-color: #444;
  border-bottom: 1px solid #444;
  padding-left: 4px;
`;

const RecipeContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 24px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
  padding: 4px 8px;
  margin-bottom: 4px;
  max-width: 140px;
  border: 1px solid #444;
  user-select: none;
`;


const RecipeImage = styled.img`
  width: 16px;
  height: 16px;
  object-fit: cover;
  border-radius: 50%;
  margin-right: 10px;
`;

const RecipeTitle = styled.div`
  font-size: 10px;
  font-weight: 500;
  text-align: left;
  width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CloseButton = styled.span`
  color: #ff3040;
  height: 12px;
  width: 12px;
  display: flex;
  cursor: pointer;
`;

const Planner = () => {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const MealCategory = ['Breakfast', 'Lunch', 'Dinner', 'Other'];
  const { planner, addRecipeToDay, removeRecipeFromDay } = useContext(PlannerContext);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    console.log('Planner state:', planner);
  }, [planner]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [, drop] = useDrop({
    accept: 'RECIPE',
    drop: (item, monitor) => {
      const { recipe } = item;
      const dropResult = monitor.getDropResult();
      console.log('Dropped item:', item);

      if (dropResult) {
        const { day, meal } = dropResult;
        addRecipeToDay(day, meal, recipe);
        console.log(`Dropped recipe ${recipe.title} into ${day}'s ${meal}!`);
      }
    },
  });

  const DropTarget = ({ day, meal }) => {
    const [, drop] = useDrop({
      accept: 'RECIPE',
      drop: (item, monitor) => {
        return {
          day,
          meal,
          recipe: item.recipe,
        };
      },
    });

    const handleRemoveRecipe = (recipeId) => {
      removeRecipeFromDay(day, meal, recipeId);
    };

    return (
      <div ref={drop} style={{ height: '100%' }}>
        {planner[day]?.[meal]?.map((recipe) => (
          <RecipeContainer key={recipe._id}>
            <RecipeImage src={recipe.images?.[0]} alt={recipe.title} />
            <RecipeTitle>{recipe.title}</RecipeTitle>
            <CloseButton onClick={() => handleRemoveRecipe(recipe._id)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
              </svg>
            </CloseButton>
          </RecipeContainer>
        ))}
      </div>
    );
  };

  const collectedProps = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
    item: monitor.getItem(),
  }));

  return (
    <Bg ref={drop}>
      <LabelContainer>
        <DayLabel>Day</DayLabel>
        <MealLabel>
          {MealCategory.map((meal) => (
            <Label key={meal}>{meal}</Label>
          ))}
        </MealLabel>
      </LabelContainer>
      {isClient &&
        daysOfWeek.map((day, index) => (
          <PlannerContainer key={day} index={index + 1}>
            <DayContainer>{day}</DayContainer>
            <ContentContainer>
              {MealCategory.map((meal) => (
                <DropTarget key={`${day}-${meal}`} day={day} meal={meal} collectedProps={collectedProps} />
              ))}
            </ContentContainer>
          </PlannerContainer>
        ))}
    </Bg>
  );
};

export default Planner;