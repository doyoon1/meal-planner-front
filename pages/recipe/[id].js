import Center from "@/components/Center";
import Header from "@/components/Header";
import { mongooseConnect } from "@/lib/mongoose";
import mongoose from "mongoose";
import { Recipe } from "@/models/Recipe";
import CategorySchema from "@/models/Category";
import styled from "styled-components";
import RecipeImages from "@/components/RecipeImages";
import Button from "@/components/Button";
import BagIcon from "@/components/icons/BagIcon";
import PrintIcon from "@/components/icons/PrintIcon";
import { BagContext } from "@/components/BagContext";
import { useContext, useState } from "react";
import Link from "next/link";
import YouTube from 'react-youtube';
import jsPDF from "jspdf";
import ScrollToTopButton from "@/components/ScrollToTop";
import copy from "copy-to-clipboard";

const PageWrapper = styled.div`
    background-color: #eee;
`;

const Title = styled.h1`
    font-size: 3em;
    font-weight: normal;
    margin: 0;
`;

const ButtonWrapper = styled.div`
    display: flex;
    gap: 4px;
`;

const Message = styled.p`
    color: #FF7F7F;
`;

const CategoryWrapper = styled.div`
    color: #666;
    margin: 0;
    margin-top: 1rem;
    font-size: 1.2rem;
    a {
        color: #666;
        text-decoration: none;
        &:hover {
            color: #111;
            transition: all .3s ease;
        }
    }
`;

const Steps = styled.p`
    color: #555;
`;

const VideoContainer = styled.div`
    text-align: center;
    margin-top: 20px;
    margin-bottom: 40px;
`;

const Label = styled.h2`
    font-size: 2rem;
    font-weight: bold;
    margin: 0;
`;

const List = styled.ul`
    list-style: none;
    padding: 0;
    background-color: #f7f7f7;
    border-radius: 4px;
    padding: 16px 16px 2px 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ListItem = styled.li`
    display: grid;
    margin-bottom: 12px;
    font-size: 1rem;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #ccc;
    grid-template-columns: 1fr 3fr;
    column-gap: 10px;
    &:last-child {
        border-bottom: none;
    }
`;

const ProcedureContainer = styled.div`
    margin-top: 20px;
`;

const ProcedureTitle = styled.h2`
    font-size: 2rem;
    font-weight: bold;
    margin: 0;
`;

const ProcedureStep = styled.div`
    margin-top: 10px;
`;

const Step = styled.p`
    font-style: italic;
    font-weight: 500;
`


const IngredientsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
`;

const NutritionalValuesContainer = styled.div`
    margin-top: 20px;
`;

const ServingsControls = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2px 10px;
    border-radius: 4px;
`;

const ServingsButton = styled.button`
    display: flex; 
    background-color: #555;
    color: #fff;
    align-items: center;
    padding: 2px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    transition: background-color 0.3s ease;

    svg {
        width: 18px;
        height: 18px;
    }

    &:hover {
        background-color: #111;
    }
`;

const ServingsLabel = styled.p`
    font-size: 16px;
    margin: 0px 16px;
    color: #333;
`;

const CopyButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Poppins', sans-serif;
  background-color: #444;
  font-size: 1rem;
  color: #fff;
  padding: 4px 12px;
  text-align: center;
  border: none;
  cursor: pointer;
  transition: all 0.4s;

  svg {
    width: 18px;
    height: 18px;
    margin-right: 4px;
  }
  &:hover {
    background-color: #111;
  }
`;

const CopyButtonWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
`;

export default function RecipePage({ recipe }) {
    const { addRecipe } = useContext(BagContext);
    const categoryArray = Array.isArray(recipe.category) ? recipe.category : [recipe.category];
    const [servings, setServings] = useState(recipe.servings);
    const originalServings = recipe.servings;
    const originalIngredients = recipe.ingredients;
    const servingsChanged = servings !== originalServings;
    const [buttonText, setButtonText] = useState('Copy');
    const [copyIcon, setCopyIcon] = useState(true);

    const generatePDF = () => {
        const doc = new jsPDF();
      
        // Set the font style to Poppins      
        // Set the title of the PDF (not centered, but bold)
        doc.setFont('Poppins', 'bold');
        doc.setFontSize(18); // Decrease font size for the title
        doc.text('MealGrub Grocery List', 10, 10); // Adjust the top margin
        doc.setFontSize(16); // Reset font size
      
        // Set the recipe name (not centered)
        doc.text(recipe.title, 10, 30); // Remove margin under the recipe name     
        
        doc.setFont('Poppins', 'normal');
      
        // Display the current serving
        doc.setFontSize(12); // Reset font size
        doc.text(`Servings: ${servings}`, 10, 40); // Add margin at the bottom of Servings

        doc.setTextColor(119); 
        // Display today's date on the same line with a space in between
        doc.setFontSize(12);
        const date = new Date().toLocaleDateString();
        const dateX = 10; // Adjust the X position as needed
        doc.text(`Date: ${date}`, dateX, 20);

        // Initialize the vertical position for ingredients
        let yPos = 50;        
        // Loop through and add each ingredient to the PDF
        updatedIngredients.forEach((ingredient) => {
            doc.text(`${ingredient.quantity} ${ingredient.measurement} - ${ingredient.name}`, 10, yPos);
            yPos += 5;
        });
      
        // Save the PDF with a unique name (e.g., recipe name + timestamp)
        const pdfFileName = `MealGrub-${recipe.title}_Ingredients_${new Date().getTime()}.pdf`;
        doc.save(pdfFileName);
    };

    const copyIngredientsToClipboard = () => {
        const ingredientsText = updatedIngredients
          .map((ingredient) => `${ingredient.quantity} ${ingredient.measurement} - ${ingredient.name}`)
          .join('\n');
    
        if (ingredientsText) {
          copy(ingredientsText);
          setButtonText('Copied');
          setCopyIcon(false); // Change the icon
          setTimeout(() => {
            setButtonText('Copy');
            setCopyIcon(true); // Reset the icon
          }, 2000);
        }
    }
      
    const decreaseServings = () => {
        if (servings > 1) {
            setServings(servings - 1);
        }
    };

    const increaseServings = () => {
        setServings(servings + 1);
    };

    // Calculate the ratio of servings change
    const servingsRatio = servings / originalServings;

    // Update ingredient measurements based on the ratio
    const updatedIngredients = originalIngredients.map((ingredient) => ({
        name: ingredient.name,
        quantity: (ingredient.quantity * servingsRatio).toFixed(2),
        measurement: ingredient.measurement,
    }));

    const nutriValueList = recipe.nutriValue.map((nutriItem, index) => (
        <ListItem key={index}>
            <span>{nutriItem.name}:</span>
            <span>{nutriItem.value}</span>
        </ListItem>
    ));

    const procedureSteps = recipe.procedure.map((step, index) => (
        <ProcedureStep key={index}>
          <Step>Step {index + 1}</Step>
          <Steps>{step}</Steps>
        </ProcedureStep>
      ));

    return (
        <PageWrapper>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap" rel="stylesheet" />
            <Header />
            <RecipeImages images={recipe.images} />
            <Center>
                <div>
                    <CategoryWrapper>
                        {categoryArray.map((cat, index) => (
                            <span key={cat._id}>
                                {index > 0 && ', '}
                                <Link href="/category/[categoryId]" as={`/category/${cat._id}`}>
                                    {cat.name}
                                </Link>
                            </span>
                        ))}
                    </CategoryWrapper>
                    <Title>{recipe.title}</Title>
                    <p>{recipe.description}</p>
                    <ButtonWrapper>
                        <Button primary onClick={() => addRecipe(recipe._id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
                        </svg>
                            Save to bag
                        </Button>
                        <Button white print onClick={generatePDF}>
                            <PrintIcon />Download Ingredients
                        </Button>
                    </ButtonWrapper>
                    <div>
                        <IngredientsContainer>
                            <Label>Ingredients</Label>
                            <ServingsControls>
                                <ServingsButton onClick={decreaseServings}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clipRule="evenodd" />
                                </svg>
                                </ServingsButton>
                                <ServingsLabel>{servings} Servings</ServingsLabel>
                                <ServingsButton onClick={increaseServings}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                                </svg>
                                </ServingsButton>
                            </ServingsControls>
                        </IngredientsContainer>
                        {servingsChanged && (
                            <div>
                                <Message>
                                    Please note that this recipe is originally designed for {originalServings} servings.
                                    Adjust quantities and cooking times as needed for {servings} servings.
                                </Message>
                            </div>
                            )}
                        <List>
                                {updatedIngredients.map((ingredient, index) => (
                                    <ListItem key={index}>
                                        <span>{ingredient.quantity} {ingredient.measurement}</span>
                                        <span>{ingredient.name}</span>
                                    </ListItem>
                                ))}
                        </List>
                        <CopyButtonWrapper>
                            <CopyButton onClick={copyIngredientsToClipboard}>
                                {copyIcon ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                                </svg>
                                ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                                )}
                                {buttonText}
                            </CopyButton>
                        </CopyButtonWrapper>
                    </div>
                    {recipe.videoLink && (
                        <VideoContainer>
                            <Label>How to Cook {recipe.title}</Label>
                            <YouTube
                                videoId={recipe.videoLink}
                                opts={{ width: '800', height: '450' }}
                            />
                        </VideoContainer>
                    )}
                    <div>
                        <ProcedureContainer>
                            <ProcedureTitle>Procedure</ProcedureTitle>
                            {procedureSteps}
                        </ProcedureContainer>
                    </div>
                    <NutritionalValuesContainer>
                        <Label>Nutritional Values</Label>
                        <List>
                            {nutriValueList}
                        </List>
                    </NutritionalValuesContainer>
                </div>
                <ScrollToTopButton />
            </Center>
        </PageWrapper>
    );
}

export async function getServerSideProps(context) {
    await mongooseConnect();
    const { id } = context.query;

    if (!mongoose.models.Category) {
        mongoose.model('Category', CategorySchema);
    }

    const recipe = await Recipe.findById(id).populate("category");

    recipe.category = Array.isArray(recipe.category) ? recipe.category : [recipe.category];

    return {
        props: {
            recipe: JSON.parse(JSON.stringify(recipe)),
        },
    };
}
