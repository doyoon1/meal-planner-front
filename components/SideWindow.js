import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import { PlannerContext } from "@/components/PlannerContext";
import jsPDF from "jspdf";
import Fraction from 'fraction.js';
import "./fonts/Poppins-Light-normal"
import "./fonts/Poppins-Medium-normal"
import "./fonts/OpenSans_Condensed-Regular-normal"
import "./fonts/Inter-Light-normal"

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

const Title = styled.h1`
  font-size: 1.5rem;
  text-align: center;
  margin: 10px 0;
  color: #111;
`;

const Content = styled.div`
  color: #111;
`;

const DayList = styled.div`
  margin: 0 1rem;
  color
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
  margin-right: 10px;
  background-color: #CDDDC9;
`;

const RecipeListItem = styled.li`
  list-style: none;
  margin-bottom: 0px;
  color: #aaa;
  padding: 2px 10px;
  color: #111;
  font-size: 12px;
  font-weight: 500;
  position: relative; /* Required for positioning the tooltip */

  /* Add tooltip styling */
  &:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #fff;
    border: 1px solid #111;
    color: #333;
    padding: 5px;
    white-space: nowrap;
    z-index: 1000; /* Set a higher z-index */
  }
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
  if (words.length > 4) {
    return words.slice(0, 3).join(' ') + '...';
  }
  return name;
};

const SideWindow = ({ isOpen }) => {
  const { planner } = useContext(PlannerContext);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Set isClient to true on the client side
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
  
  const downloadMealPlan = () => {
    generatePDF();
  };

  return (
    <WindowContainer isOpen={isOpen}>
      <Title>MealGrub Planner</Title>
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
