import styled from "styled-components";
import Center from "./Center";
import RecipesGrid from "./RecipesGrid";

const Title = styled.h2`
    font-size: 1.8rem;
    margin: 20px 0 20px;
    font-weight: 500;
`;

export default function NewRecipes ({recipes}) {
    return (
        <Center>
            <Title>New Arrivals</Title>
            <RecipesGrid recipes={recipes} />
        </Center>
    );
}