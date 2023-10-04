import Center from "@/components/Center";
import Header from "@/components/Header";
import { mongooseConnect } from "@/lib/mongoose";
import { Recipe } from "@/models/Recipe";
import styled from "styled-components";
import RecipeImages from "@/components/RecipeImages";
import Button from "@/components/Button";
import BagIcon from "@/components/icons/BagIcon";
import PrintIcon from "@/components/icons/PrintIcon";
import { BagContext } from "@/components/BagContext";
import { useContext } from "react";

const Title = styled.h1`
    font-size: 3em;
    font-weight: normal;
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
    padding: 8px;
    border-bottom: 1px solid #ccc;
    font-size: 2.2rem;
    font-weight: normal;
`;

const TableData = styled.td`
    padding: 8px;
    border-bottom: 1px solid #ccc;
`;

export default function RecipePage({ recipe }) {
    const { addRecipe } = useContext(BagContext);

    const ingredientRows = recipe.ingredients.map((ingredient, index) => (
        <tr key={index}>
            <TableData>{ingredient.quantity} {ingredient.measurement}</TableData>
            <TableData>{ingredient.name}</TableData>
        </tr>
    ));

    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap" rel="stylesheet" />
            <Header />
            <RecipeImages images={recipe.images} />
            <Center>                       
                    <div>
                        <p>{recipe.category}</p>
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
                            <IngredientTable>
                                    <TableHeader>Ingredients</TableHeader>
                                    <TableHeader></TableHeader>
                                <thead>
                                    <tr>

                                    </tr>
                                </thead>
                                <tbody>
                                    {ingredientRows}
                                </tbody>
                            </IngredientTable>
                        </div>
                        <p>{recipe.procedure}</p>
                    </div>
            </Center>
        </>
    );
}

export async function getServerSideProps(context) {
    await mongooseConnect();
    const { id } = context.query;
    const recipe = await Recipe.findById(id);
    return {
        props: {
            recipe: JSON.parse(JSON.stringify(recipe)),
        }
    };
}