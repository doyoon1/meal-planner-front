import React, { useContext, useEffect, useState } from "react";
import { PlannerContext } from "@/components/PlannerContext";
import Header from "@/components/Header";
import Center from "@/components/Center";
import styled from "styled-components";
import jsPDF from "jspdf";
import Fraction from "fraction.js";

const PlannerContainer = styled.div`
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DownloadButtonWrapper = styled.div`
  margin-top: 20px;
  text-align: center;
  margin-bottom: 20px;
`;

const DownloadButton = styled.button`
  background-color: #111;
  color: #fff;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  border-radius: 5px;
  font-family: 'Poppins', sans-serif;
  text-transform: uppercase;
`;

const DayContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
`;

const DayHeading = styled.h3`
  background-color: #CDDDC9;
  padding: 8px 10px;
  font-weight: 500;
  color: #222;
  font-size: 14px;
  text-transform: uppercase;
`;

const RecipeList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start; 
`;

const ImageContainer = styled.div`
  width: 80px;
  height: 80px;
  margin-right: 10px;
  border-radius: 8px;
  overflow: hidden;
`;

const DateRange = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #444;
  text-align: center;
`;

const RecipeListItem = styled.li`
  margin-bottom: 10px;
  margin-left: 10px;
  color: #111;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center; /* Center vertically */
  position: relative;
  width: 100%; /* Added to ensure the button stays on the right */

  ${ImageContainer} {
    margin-right: 10px; /* Add some spacing between the image and the text */
  }

  ${ImageContainer} img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;

const RemoveButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  margin-left: auto;
  margin-right: 20px;

  svg {
    fill: #e53935; 
    width: 24px; /* Adjust icon size as needed */
    height: 24px; /* Adjust icon size as needed */
  }
`;

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const getWeekDates = () => {
  const today = new Date();
  const startOfWeek = new Date(today);
  const endOfWeek = new Date(today);

  // Set to Monday of the current week
  startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
  
  // Set to Sunday of the current week
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const options = { month: 'long', day: 'numeric' };
  const startFormatted = startOfWeek.toLocaleDateString(undefined, options);
  const endFormatted = endOfWeek.toLocaleDateString(undefined, options);

  return `${startFormatted} - ${endFormatted}`;
};

// PlannerPage component
const PlannerPage = () => {
  const { planner, removeRecipeFromDay } = useContext(PlannerContext);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    const maxLinesPerPage = 52;
    let currentLine = 0;
    let currentPage = 1;
    const columnWidth = 100; // Adjust this value based on your needs
  
    // Function to add a new page and set the title
    const addNewPage = () => {
      doc.addPage();
      doc.setFont('Poppins-Medium', 'normal');
      doc.setFontSize(14);
      doc.setTextColor(17, 17, 17); // RGB values for dark gray
      doc.text("MealGrub", 10, 10);
      doc.setFontSize(12);
      doc.setTextColor(64, 64, 64); // RGB values for dark gray

      doc.setFont("Inter-Light, normal");
      doc.setFontSize(10);
      currentLine = 0;
      currentPage += 1;
    };
  
    // Set the font style and size for the title
    doc.setFont('Poppins-Medium', 'normal');
    doc.setFontSize(14);
  
    // Set the title of the PDF
    doc.text("MealGrub", 10, 10);
  
    // Use an object to track unique ingredients and their quantities
    const ingredientMap = {};
  
    // Loop through each day and recipe in the planner
    daysOfWeek.forEach((day) => {
      if (planner[day]) {
        planner[day].forEach((recipe) => {
          // Loop through ingredients for the current recipe
          recipe.ingredients.forEach((ingredient) => {
            // Check if the ingredient already exists in the map
            if (ingredientMap[ingredient.name]) {
              // If it exists, add the quantity to the existing value
              ingredientMap[ingredient.name].quantity += parseFloat(ingredient.quantity);
            } else {
              // If it doesn't exist, add a new entry to the map
              ingredientMap[ingredient.name] = {
                quantity: parseFloat(ingredient.quantity),
                measurement: ingredient.measurement,
              };
            }
          });
        });
      }
    });
  
    // Set the font size for the ingredients
    doc.setFontSize(10);

    doc.setTextColor(64, 64, 64); // RGB values for dark gray
  
    // Set the font family for the ingredients
    doc.setFont("Inter-Light, normal");
  
    // Add a title before the separator line
    doc.text("Ingredients:", 10, 20);
  
    // Add a separator line
    const separatorY = 23;
    doc.line(10, separatorY, 200, separatorY);
  
    // Create a string with combined ingredients
    const ingredientsString = Object.entries(ingredientMap)
      .map(([name, info]) => {
        const quantity = new Fraction(info.quantity).toFraction(true);
        return `${quantity} ${info.measurement} - ${name}`;
      })
      .join('\n');
  
    // Add ingredients to the column based on available space
    const ingredientsLines = doc.splitTextToSize(ingredientsString, columnWidth);
    ingredientsLines.forEach((line) => {
      // Check if we need to add a new page
      if (currentLine >= maxLinesPerPage) {
        addNewPage();
      }
  
      // Adjust the y-coordinate on the new page
      const yCoordinate = currentPage === 1 ? separatorY + 6 + currentLine * 5 : 20 + currentLine * 5;
  
      // Add the line to the current column
      doc.text(line, 10, yCoordinate);
      currentLine += 1;
    });
  
    // Save the PDF with a unique name (e.g., meal plan + timestamp)
    const pdfFileName = `MealGrub-MealPlan_${new Date().getTime()}.pdf`;
    doc.save(pdfFileName);
  };
  
  const downloadWeeklyPlanner = () => {
    generatePDF();
  };

  
  const renderRecipesForDay = (planner, day) => {
    const handleRemoveRecipe = (recipeId) => {
      removeRecipeFromDay(day, recipeId);
    };
  
    return (
      <DayContainer key={day}>
      <DayHeading>{day}</DayHeading>
      <RecipeList>
        {planner[day] ? (
          planner[day].map((recipe, index) => (
            <RecipeListItem key={index}>
              <ImageContainer>
                <img src={recipe.images?.[0]} alt={recipe.title} />
              </ImageContainer>
              {recipe.title} - Servings: {recipe.servings}
              <RemoveButton onClick={() => handleRemoveRecipe(recipe._id)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                </svg>
              </RemoveButton>
            </RecipeListItem>
          ))
        ) : (
          <p>No recipes planned for {day}.</p>
        )}
      </RecipeList>
    </DayContainer>
    );
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap" rel="stylesheet" />
      <Header />
      <Center>
        <h2>My Planner</h2>
        <DateRange>{getWeekDates()}</DateRange>
        <PlannerContainer>
          {isClient &&
            daysOfWeek.map((day) => renderRecipesForDay(planner, day))}
        </PlannerContainer>
        <DownloadButtonWrapper>
          <DownloadButton onClick={downloadWeeklyPlanner}>Download Weekly Planner</DownloadButton>
        </DownloadButtonWrapper>
      </Center>
    </>
  );
};

export default PlannerPage;