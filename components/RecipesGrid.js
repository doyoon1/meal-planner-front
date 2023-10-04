import styled from "styled-components";
import RecipeBox from "./RecipeBox";

const StyledRecipesGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    margin-bottom: 30px;
    @media screen and (min-width: 768px) {
        grid-template-columns: 1fr 1fr 1fr 1fr;
    }
`;

export default function RecipesGrid({recipes}) {
    return (
        <StyledRecipesGrid>
            {recipes?.length > 0 && recipes.map(recipe => (
                <RecipeBox key={recipe._id} {...recipe} />
            ))}
        </StyledRecipesGrid>
    );
}