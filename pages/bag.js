import { BagContext } from "@/components/BagContext";
import Center from "@/components/Center";
import Header from "@/components/Header";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import RecipeBox from "@/components/RecipeBox";
import RecipeModal from "@/components/RecipeDetails";

const RecipesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px; 
`;

export default function BagPage () {
    const { bagRecipes } = useContext(BagContext);
    const [recipes, setRecipes] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState(null);

    useEffect(() => {
        if (bagRecipes.length > 0) {
            axios.post('/api/bag', { ids: bagRecipes })
                .then(response => {
                    setRecipes(response.data);
                });
        }
    }, [bagRecipes]);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleRecipeClick = (recipe) => {
        setSelectedRecipe(recipe);
        openModal();
    };

    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap" rel="stylesheet"/>
            <Header />
            <Center>
                <h2>My Bag</h2>
                {!bagRecipes?.length && (
                    <div>Your grocery bag is empty</div>
                )}
                {recipes?.length > 0 && (
                    <RecipesGrid>
                        {recipes.map(recipe => (
                            <RecipeBox
                                key={recipe._id}
                                {...recipe}
                                openModal={() => handleRecipeClick(recipe)}
                            />
                        ))}
                    </RecipesGrid>
                )}
            </Center>
            <RecipeModal isOpen={modalIsOpen} closeModal={closeModal} recipe={selectedRecipe} />
        </>
    );
}
