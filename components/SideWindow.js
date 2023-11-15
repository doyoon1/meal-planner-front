import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import { PlannerContext } from "@/components/PlannerContext";
import jsPDF from "jspdf";
import Fraction from 'fraction.js';
import "./fonts/Poppins-Light-normal"
import "./fonts/Poppins-Medium-normal"
import "./fonts/OpenSans_Condensed-Regular-normal"
import "./fonts/Inter-Regular-normal"
import "./fonts/Inter-Bold-normal"
import "./fonts/RobotoSlab-Medium-bold"

const WindowContainer = styled.div`
  position: fixed;
  top: 0;
  right: ${(props) => (props.isOpen ? "0" : "-390px")};
  width: 390px;
  height: 100%;
  background-color: #fff;
  transition: right 0.5s;
  box-shadow: ${(props) => (props.isOpen ? "5px 0 20px rgba(0, 0, 0, 0.5)" : "none")};
  z-index: 999;
  padding-bottom: 2rem;
  overflow-y: auto; /* Add vertical scrolling to the entire content */
`;

const TitleWrapper = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  text-align: center;
  margin: 10px 0;
  color: #111;
`;

const Content = styled.div`
  color: #111;
`;

const DayListItemWrapper = styled.div`
  border-radius: 8px;
  margin-bottom: 10px;
  margin: 0 1rem;
`;

const DayListItem = styled.h2`
  padding: 8px 10px;
  font-weight: 500;
  color: #222;
  font-size: 14px;
  background-color: #CDDDC9;
`;

const RecipeListItem = styled.li`
  list-style: none;
  margin-bottom: 0px;
  color: #aaa;
  padding: 2px 4px;
  color: #111;
  font-size: 12px;
  font-weight: 500;
  position: relative; /* Required for positioning the tooltip */
  display: flex; /* Use flexbox for layout */
  align-items: center; /* Center items vertically */

  // /* Add tooltip styling */
  // &:hover::after {
  //   content: attr(data-tooltip);
  //   position: absolute;
  //   top: 100%;
  //   left: 50%;
  //   transform: translateX(-50%);
  //   background-color: #fff;
  //   border: 1px solid #111;
  //   color: #333;
  //   padding: 5px;
  //   white-space: nowrap;
  //   z-index: 1000; /* Set a higher z-index */
  // }
`;

const DownloadButtonWrapper = styled.div`
  text-align: center;
  margin: 20px 0;

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

const RemoveButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  margin-left: auto;
  margin-right: 1px;
  display: flex;
`;

const RemoveButtonIcon = styled.svg`
  fill: #e53935;
  width: 16px;
  height: 16px;
  margin-right: 5px;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 0 1rem;
`;

const TitleInput = styled.input`
  height: 18px;
  width: 100%; /* Adjust width as needed */
  padding: 5px 10px;
  font-weight: 500;
  font-size: 12px;
  font-family: 'Poppins', sans-serif;
  border: 1px solid #CDDDC9;
  border-radius: 4px;
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

const truncateRecipeName = (name) => {
  const words = name.split(' ');
  if (words.length > 5) {
    return words.slice(0, 5).join(' ') + '...';
  }
  return name;
};

const SideWindow = ({ isOpen }) => {
  const { planner, removeRecipeFromDay } = useContext(PlannerContext);
  const [isClient, setIsClient] = useState(false);
  const [pdfTitle, setPdfTitle] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    const maxLinesPerPage = 43;
    let currentLine = 0;
    let currentPage = 1;
    const columnWidth = 100; // Adjust this value based on your needs
    const today = new Date();
  
    const ingredientMap = {};
    const addedRecipes = new Set();
  
    // Initialize y-coordinate for recipe titles
    let recipeTitlesY = 30;
  
    // Function to add a new page and set the title
    const addNewPage = () => {
      doc.addPage();
      doc.setFont('Poppins-Medium', 'normal');
      doc.setFontSize(18);
      const originLink = window.location.origin; // Get the origin of the page
      doc.setTextColor(86, 130, 3);
      
      // Make the title clickable and set the link to the origin
      doc.textWithLink("MealGrub", 10, 10, { url: originLink });

      doc.setFontSize(12);
      doc.setTextColor(64, 64, 64);

      // Set the font family for the ingredients
      doc.setFont('RobotoSlab-Medium', 'bold');
      doc.setFontSize(10);
      currentLine = 0;
      currentPage += 1;
    };

    // Set the font style and size for the title
    doc.setFont('Poppins-Medium', 'normal');
    doc.setFontSize(18);
    
    // Make the title on the first page clickable
    const originLink = window.location.origin;
    doc.setTextColor(86, 130, 3);
    doc.textWithLink("MealGrub", 10, 10, { url: originLink });
  
    doc.setTextColor(17, 17, 17);
    doc.setFont('Inter-Regular', 'normal');
    doc.setFontSize(10);
  
    // Add a title text with an underline
    doc.text("Title:", 10, 20);
  
    // If pdfTitle is not empty, add the filled title with an underline
    if (pdfTitle) {
      doc.setFont('Inter-Bold', 'normal');
      doc.text(`${pdfTitle}`, 19, 20);
    }
  
    // Add Date label
    doc.setFont('Inter-Regular', 'normal');
    doc.text("Date:", 161, 20);
  
    doc.setFont('Inter-Bold', 'normal');
    // Add the current date
    doc.text(today.toDateString(), 171, 20);
  
    // Loop through each day and recipe in the planner
    daysOfWeek.forEach((day) => {
      if (planner[day]) {
        planner[day].forEach((recipe) => {
          // Check if the recipe has been added before
          if (!addedRecipes.has(recipe._id)) {
            // Add recipe name
            doc.setFont('Inter-Bold', 'normal');
            // Make the recipe name clickable
            const recipeLink = `${window.location.origin}/recipe/${recipe._id}`;
            doc.setTextColor(4, 30, 66);
            doc.textWithLink(`${recipe.title}`, 10, recipeTitlesY, { url: recipeLink });
            doc.setTextColor(64, 64, 64); // Reset the color to dark gray for subsequent text
            recipeTitlesY += 5;
            // Mark the recipe as added
            addedRecipes.add(recipe._id);
  
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
          }
        });
      }
    });
  
    // Set the font size for the ingredients
    doc.setFontSize(10);
    doc.setTextColor(64, 64, 64); // RGB values for dark gray
  
    // Set the font family for the ingredients
    doc.setFont('RobotoSlab-Medium', 'bold');
  
    // Set the y-coordinate for the "Ingredients:" title based on recipeTitlesY
    doc.setTextColor(17, 17, 17);
    const ingredientsTitleY = recipeTitlesY + 5;
    doc.text("Ingredients:", 10, ingredientsTitleY);
  
    // Set the y-coordinate for the separator line based on ingredientsTitleY
    const separatorY = ingredientsTitleY + 3;
    doc.line(10, separatorY, 200, separatorY);

    doc.setTextColor(64, 64, 64);
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
  
    // Get the current date for the PDF file name
    const dateFormatted = `${today.toLocaleString('default', { month: 'long' })}_${today.getDate()}_${today.getFullYear()}`;
  
    // Save the PDF with a unique name (e.g., meal plan + timestamp)
    const pdfFileName = `MealGrub-MealPlan_${dateFormatted}.pdf`;
    doc.save(pdfFileName);
  };
  
  const downloadMealPlan = () => {
    generatePDF();
  };
    
  const handleRemoveRecipe = (day, recipeId) => {
    removeRecipeFromDay(day, recipeId);
  };

  return (
    <WindowContainer isOpen={isOpen}>
      <TitleWrapper>
        <Title>MealGrub Planner</Title>
      </TitleWrapper>
      <TitleContainer>
        <TitleInput
          type="text"
          placeholder="Enter your meal plan title"
          value={pdfTitle}
          onChange={(e) => setPdfTitle(e.target.value)}
        />
      </TitleContainer>
      <Content>
        {isClient &&
          daysOfWeek.map((day) => (
            <DayListItemWrapper key={day}>
              <DayListItem>{day.toUpperCase()}</DayListItem>
              {planner[day] && (
                <>
                  {planner[day].map((recipe, index) => (
                    <RecipeListItem key={index} data-tooltip={recipe.title}>
                      {truncateRecipeName(recipe.title)} - Servings: {recipe.servings}
                      <RemoveButton onClick={() => handleRemoveRecipe(day, recipe._id)}>
                        <RemoveButtonIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                        </RemoveButtonIcon>
                      </RemoveButton>
                    </RecipeListItem>
                  ))}
                </>
              )}
            </DayListItemWrapper>
          ))}
        <DownloadButtonWrapper>
          <DownloadButton onClick={downloadMealPlan}>Download Meal Plan</DownloadButton>
        </DownloadButtonWrapper>
      </Content>
    </WindowContainer>
  );
};

export default SideWindow;
