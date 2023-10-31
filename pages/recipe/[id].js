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

const Title = styled.h1`
    font-size: 3em;
    font-weight: normal;
    margin: 0;
`;

const ButtonWrapper = styled.div`
    display: flex;
    gap: 4px;
`;

const IngredientTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin: 40px 0;
`;

const TableHeader = styled.th`
    text-align: left;
    padding-bottom: 8px;
    border-bottom: none;
    font-size: 2.2rem;
    font-weight: normal;
`;

const TableData = styled.td`
    padding: 8px;
    border-bottom: 1px solid #ccc;
    color: #555;
    font-size: 1rem;
`;

const CategoryWrapper = styled.div`
    color: #666;
    margin: 0;
    margin-top: 1rem;
    a {
        color: #666;
        text-decoration: none;
        &:hover {
            text-decoration: none;
            color: #111;
            transition: all .3s ease;
        }
    }
`;

const Procedure = styled.p`
    padding-bottom: 8px;
    text-align: left;
    font-size: 2.2rem;
    font-weight: normal;
`;

const Steps = styled.p`
    color: #666;
`;

export default function RecipePage({ recipe }) {
    const { addRecipe } = useContext(BagContext);
    const categoryArray = Array.isArray(recipe.category) ? recipe.category : [recipe.category];
    const categoryNames = categoryArray.map((cat) => cat?.name).join(", ");
    const [servings, setServings] = useState(recipe.servings);
    const originalServings = recipe.servings; 
    const originalIngredients = recipe.ingredients; 

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

    const ingredientRows = updatedIngredients.map((ingredient, index) => (
        <tr
            key={index}
            style={{
                backgroundColor: index % 2 === 0 ? "#f0f0f0" : "#ffffff",
            }}
        >
            <TableData>{ingredient.quantity} {ingredient.measurement}</TableData>
            <TableData>{ingredient.name}</TableData>
        </tr>
    ));

    const nutriValueRows = recipe.nutriValue.map((nutriItem, index) => (
        <tr
            key={index}
            style={{
                backgroundColor: index % 2 === 0 ? "#f0f0f0" : "#ffffff",
            }}
        >
            <TableData>{nutriItem.name}</TableData>
            <TableData>{nutriItem.value}</TableData>
        </tr>
    ));

    const procedureSteps = recipe.procedure.map((step, index) => (
        <div key={index}>
            <p><strong>Step {index + 1}</strong></p>
            <Steps>{step}</Steps>
        </div>
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
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <button onClick={decreaseServings}>-</button>
                                <p>Servings: {servings}</p>
                                <button onClick={increaseServings}>+</button>
                            </div>
                        <IngredientTable>
                            <thead>
                            <tr>
                                <TableHeader colSpan="2">Ingredients</TableHeader>
                            </tr>
                            </thead>
                            <tbody>
                                {ingredientRows}
                            </tbody>
                        </IngredientTable>
                    </div>
                    <div>
                        <Procedure>Procedure</Procedure>
                        {procedureSteps}
                    </div>
                    <div>
                        <IngredientTable>
                            <thead>
                                <tr>
                                    <TableHeader colSpan="2">Nutritional values</TableHeader>
                                </tr>
                            </thead>
                            <tbody>
                                {nutriValueRows}
                            </tbody>
                        </IngredientTable>
                    </div>
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