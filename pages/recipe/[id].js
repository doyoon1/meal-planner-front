import Center from "@/components/Center";
import Header from "@/components/Header";
import { mongooseConnect } from "@/lib/mongoose";
import mongoose from "mongoose";
import { Recipe } from "@/models/Recipe";
import CategorySchema from "@/models/Category";
import styled from "styled-components";
import RecipeImages from "@/components/RecipeImages";
import Button from "@/components/Button";
import PrintIcon from "@/components/icons/PrintIcon";
import { BagContext } from "@/components/BagContext";
import { useContext, useState } from "react";
import Link from "next/link";
import YouTube from 'react-youtube';
import jsPDF from "jspdf";
import ScrollToTopButton from "@/components/ScrollToTop";
import copy from "copy-to-clipboard";
import Fraction from 'fraction.js';
import "@/components/fonts/Poppins-Light-normal"
import "@/components/fonts/Poppins-Medium-normal"
import "@/components/fonts/OpenSans_Condensed-Regular-normal"
import "@/components/fonts/Inter-Regular-normal"
import "@/components/fonts/Inter-Bold-normal"
import "@/components/fonts/RobotoSlab-Medium-bold"

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
    font-size: 1rem;
    text-align: right;
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
    margin: 0 10px;
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
    const [sets, setSets] = useState(1);
    const [servings, setServings] = useState(recipe.servings);
    const originalServings = recipe.servings;
    const originalIngredients = recipe.ingredients;
    const [servingsChanged, setServingsChanged] = useState(false);
    const [buttonText, setButtonText] = useState('Copy');
    const [copyIcon, setCopyIcon] = useState(true);

    const generatePDF = () => {
        const doc = new jsPDF();
        const today = new Date();
      
        // Set the font style to Poppins
        doc.setFont('Poppins-Medium', 'normal');
      
        // Set the title of the PDF (not centered, but bold)
        doc.setFontSize(18);
      
        // Create a link to the recipe page
        const recipeLink = `${window.location.origin}/recipe/${recipe._id}`;
        const originLink = window.location.origin;
        doc.setTextColor(86, 130, 3);
        doc.textWithLink("MealGrub", 10, 10, { url: originLink });
      
        // Reset font size
        doc.setFontSize(16);
      
        doc.setFont('Inter-Regular', 'normal');
        doc.setTextColor(17, 17, 17);
        doc.setFontSize(10);
        doc.text("Title:", 10, 20);
        doc.text("Servings:", 10, 25);
        doc.setFont('Inter-Bold', 'normal');
      
        // Set the title as a hyperlink
        doc.textWithLink(recipe.title, 19, 20, { url: recipeLink });
      
        doc.text(`${servings}`, 26, 25);
      
        // Add Date label
        doc.setFont('Inter-Regular', 'normal');
        doc.text("Date:", 161, 20);
      
        doc.setFont('Inter-Bold', 'normal');
        // Add the current date
        doc.text(today.toDateString(), 171, 20);
      
        doc.setFontSize(10);
        doc.setTextColor(64, 64, 64); // RGB values for dark gray
      
        // Set the font family for the ingredients
        doc.setFont('RobotoSlab-Medium', 'bold');
      
        // Add a title before the separator line
        doc.text("Ingredients:", 10, 35); // Adjusted y-coordinate here
      
        // Add a separator line
        const separatorY = 38; // Adjusted y-coordinate here
        doc.line(10, separatorY, 200, separatorY);
      
        // Initialize the vertical position for ingredients
        let yPos = 44;
      
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
      
    const increaseSets = () => {
        setSets(sets + 1);
        const newServings = originalServings * (sets + 1);
        setServings(newServings);
        setServingsChanged(newServings !== originalServings);
    };

    const decreaseSets = () => {
        if (sets > 1) {
            setSets(sets - 1);
            const newServings = originalServings * (sets - 1);
            setServings(newServings);
            setServingsChanged(newServings !== originalServings);
        }
    };

    // Calculate the ratio of servings change
    const servingsRatio = servings / originalServings;
    const updatedIngredients = originalIngredients.map((ingredient) => ({
        name: ingredient.name,
        quantity: new Fraction(ingredient.quantity).mul(servingsRatio).toFraction(true),
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
                            <ServingsLabel>Servings: {servings}</ServingsLabel>
                            <ServingsButton onClick={decreaseSets}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clipRule="evenodd" />
                                </svg>
                                </ServingsButton>
                                <ServingsLabel>{sets} {sets === 1 ? 'set' : 'sets'}</ServingsLabel>
                                <ServingsButton onClick={increaseSets}>
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