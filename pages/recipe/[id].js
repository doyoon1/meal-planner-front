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
import { format } from 'date-fns';
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
    font-weight: bold;
    margin: 0;
`;

const Description = styled.p`
    font-size: 1em;
    font-weight: normal;
    text-align: justify;
    margin: 12px 0;

`;

const ButtonWrapper = styled.div`
    display: flex;
    gap: 4px;
`;

const Message = styled.p`
    color: #ff3333;
    font-size: 12px;
`;

const CategoryWrapper = styled.div`
    color: #666;
    margin: 0;
    font-size: 12px;
    a {
        color: #666;
        text-decoration: none;
        &:hover {
            color: #111;
            transition: all .3s ease;
        }
    }
`;

const VideoContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    text-align: center;
    margin-top: 20px;
`;

const Label = styled.h2`
    font-size: 1.8rem;
    font-weight: normal;
    margin: 0;
    font-family: 'League Spartan', sans-serif;
`;


const Info = styled.div`
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    margin: 20px 0;
    gap: 0;
    p{
        font-size: 14px;
        margin: 0;
        font-weight: bold;
        font-style: italic;
    }
    span{
        font-weight: 500;
    }

`;

const TextLabel = styled.h2`
    font-size: 1.4rem;
    font-weight: bold;
    margin: 0;
    text-align: center;
`;

const List = styled.ul`
    list-style: none;
    padding: 0;
`;

const ListItem = styled.li`
    display: grid;
    margin-bottom: 8px;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #ccc;
    grid-template-columns: 1fr 1fr;
    column-gap: 40px;
    &:last-child {
        border-bottom: none;
    }
`;

const Name = styled.span`
    font-size: 14px;
`;

const ProcedureContainer = styled.div`
    margin-top: 20px;
`;

const ProcedureStep = styled.div`
    margin-top: 10px;
    margin: 0 10px;
    display: flex;
    gap: 10px;
`;

const Step = styled.p`
    font-weight: bold;
    flex: 1;
    font-style: italic;
`;

const Steps = styled.p`
    font-weight: normal;
    flex: 8;
`;


const IngredientsContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-top: 10px;
    background-color: #f7f7f7;
    padding: 16px 16px 2px 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NutritionalValuesContainer = styled.div`
    margin-top: 20px;
    margin-top: 20px;
    background-color: #f7f7f7;
    padding: 16px 16px 2px 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ServingsControls = styled.div`
    display: flex;
    margin: 12px 0;
    justify-content: space-between;
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
        width: 14px;
        height: 14px;
    }

    &:hover {
        background-color: #111;
    }
`;

const ServingsLabel = styled.p`
    font-size: 14px;
    margin: 0px 16px 0px 0px;
    color: #333;
`;

const SetContainer = styled.div`
    display: flex;
    gap: 10px;
`;

const SetLabel = styled.p`
    font-size: 14px;
    margin: 0px;
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

const ColumnWrapper = styled.div`
  display: flex;
  margin: 20px 0;
`;

const LeftColumn = styled.div`
  flex: 2;
  padding: 16px 16px 0 0 ;
  position: relative;
`;

const RightColumn = styled.div`
  flex: 1;
  padding: 16px 0px;
`;

const RecipeImageContainer = styled.div`
  position: relative;
`;

const RecipeImage = styled.img`
  height: 400px;
  width: 100%;
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  color: #333;
  background: none;
  border: none;
  cursor: pointer;
`;

const PreviousButton = styled(NavigationButton)`
  left: 20px;
  height: 40px;
  width: 40px;
  color: #fff;
  background-color: #333;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.1s ease, left 0.3s ease; /* Combine transitions */
  svg {
    height: 24px;
    width: 24px;
  }
  &:hover {
    background-color: #111;
    left: 18px;
  }
`;

const NextButton = styled(NavigationButton)`
  right: 20px;
  height: 40px;
  width: 40px;
  color: #fff;
  background-color: #333;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.1s ease, right 0.1s ease; /* Combine transitions */
  svg {
    height: 24px;
    width: 24px;
  }
  &:hover {
    background-color: #111;
    right: 18px;
  }
`;

const PreviousIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
    </svg>
);
  
const NextIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
    </svg>
);

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
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const formattedCreatedAt = format(new Date(recipe.createdAt), 'MMMM dd, yyyy');
    const formattedUpdatedAt = format(new Date(recipe.updatedAt), 'MMMM dd, yyyy');

    const handlePrevImage = () => {
        setActiveImageIndex((prevIndex) => (prevIndex - 1 + recipe.images.length) % recipe.images.length);
    };

    const handleNextImage = () => {
        setActiveImageIndex((prevIndex) => (prevIndex + 1) % recipe.images.length);
    };

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
    const updatedIngredients = originalIngredients.map((ingredient, index) => {    
        return {
            name: ingredient.name,
            quantity: new Fraction(ingredient.quantity.trim()).mul(servingsRatio).toFraction(true),
            measurement: ingredient.measurement,
        };
    });     

    const nutriValueList = recipe.nutriValue.map((nutriItem, index) => (
        <ListItem key={index}>
            <span>{nutriItem.name}</span>
            <span>{nutriItem.value}</span>
        </ListItem>
    ));

    const procedureSteps = recipe.procedure.map((step, index) => (
        <ProcedureStep key={index}>
          <Step>{`Step ${index + 1} `}</Step>
          <Steps>{step}</Steps>
        </ProcedureStep>
    ));

    return (
        <PageWrapper>
            <Header />
            <Center>
                <div>
                    <ColumnWrapper>
                        <LeftColumn>
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
                            <Info>
                                <p>By: <span>{recipe.citation}</span></p>
                                <p>Posted: <span>{formattedCreatedAt}</span></p>
                                {recipe.createdAt !== recipe.updatedAt && (
                                    <p>Updated: <span>{formattedUpdatedAt}</span></p>
                                )}
                            </Info>
                            <Description>{recipe.description}</Description>
                            <RecipeImageContainer>
                                <RecipeImage src={recipe.images?.[activeImageIndex]} alt="" />
                                {recipe.images.length > 1 && (
                                <div>
                                    <PreviousButton onClick={handlePrevImage}>{PreviousIcon}</PreviousButton>
                                    <NextButton onClick={handleNextImage}>{NextIcon}</NextButton>
                                </div>
                                )}
                            </RecipeImageContainer>

                            {recipe.videoLink && (
                                <VideoContainer>
                                    <TextLabel>How to Cook {recipe.title}</TextLabel>
                                    <YouTube
                                        videoId={recipe.videoLink}
                                        opts={{ width: '100%', height: '400' }}
                                    />
                                </VideoContainer>
                            )}
                            <div>
                                <ProcedureContainer>
                                    <TextLabel>Procedure</TextLabel>
                                    {procedureSteps}
                                </ProcedureContainer>
                            </div>
                        </LeftColumn>
                        <RightColumn>
                            <IngredientsContainer>
                            <Label>Ingredients</Label>
                            <ServingsControls>
                                <ServingsLabel>Servings: {servings}</ServingsLabel>
                                <SetContainer>
                                    <ServingsButton onClick={decreaseSets}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                            <path fillRule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clipRule="evenodd" />
                                        </svg>
                                        </ServingsButton>
                                        <SetLabel>{sets} {sets === 1 ? 'set' : 'sets'}</SetLabel>
                                        <ServingsButton onClick={increaseSets}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                                        </svg>
                                    </ServingsButton>
                                </SetContainer>
                            </ServingsControls>
                            {servingsChanged && (
                                <Message>
                                    Please note that this recipe is originally designed for {originalServings} servings.
                                    Adjust quantities and cooking times as needed for {servings} servings.
                                </Message>
                            )}
                            <List>
                                    {updatedIngredients.map((ingredient, index) => (
                                        <ListItem key={index}>
                                            <Name>{ingredient.quantity} {ingredient.measurement}</Name>
                                            <Name>{ingredient.name}</Name>
                                        </ListItem>
                                    ))}
                            </List>
                            </IngredientsContainer>
                            
                            <NutritionalValuesContainer>
                            <Label>Nutritional Values</Label>
                            <List>
                                <Name>{nutriValueList}</Name>
                            </List>
                        </NutritionalValuesContainer>
                        </RightColumn>
                    </ColumnWrapper>
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