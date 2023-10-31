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
            text-decoration: underline;
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
export default function RecipePage({ recipe }) {
    const { addRecipe } = useContext(BagContext);
    const categoryArray = Array.isArray(recipe.category) ? recipe.category : [recipe.category];
    const [servings, setServings] = useState(recipe.servings);
    const originalServings = recipe.servings;
    const originalIngredients = recipe.ingredients;
    const servingsChanged = servings !== originalServings;

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
        <>
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
                            <BagIcon />Add to bag
                        </Button>
                        <Button white print>
                            <PrintIcon />Print ingredients
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
            </Center>
        </>
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
