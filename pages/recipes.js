import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import { mongooseConnect } from "@/lib/mongoose";
import { Recipe } from "@/models/Recipe";
import RecipesGrid from "@/components/RecipesGrid";

const Title = styled.h2`
    font-size: 1.8rem;
    margin: 30px 0 20px;
    font-weight: 500;
`;

export default function RecipesPage({recipes}) {
    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap" rel="stylesheet"/>
            <Header />
            <Center>
                <Title>All recipes</Title>
                <RecipesGrid recipes={recipes} />
            </Center>
        </>
    );
}

export async function getServerSideProps() {
    await mongooseConnect();
    const recipes = await Recipe.find({}, null, {sort:{'_id':-1}});
    return {
        props:{
            recipes: JSON.parse(JSON.stringify(recipes)),
    }};
}