import styled from "styled-components";
import Button from "./Button";
import Link from "next/link";
import { useContext, useState } from "react";
import { BagContext } from "./BagContext";

const RecipeWrapper = styled.div`
  height: 260px;
  background-color: #fff;
  text-decoration: none;
  transition: transform 0.2s ease-in-out;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;

  &:hover {
    transform: scale(0.99);
    box-shadow: 0 2px 2.2px rgba(0, 0, 0, 0.034), 0 6.7px 5.3px rgba(0, 0, 0, 0.048);
  }
`;

const ImageWrapper = styled.div`
  padding: 0;
  height: 200px;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;

  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
`;

const NameWrapper = styled.div`
  color: #111;
  margin-left: 8px;
  margin-top: 8px;
  font-weight: 500;
  width: 85%;
`;

const ButtonWrapper = styled.div`
  margin: 0;
  padding: 0;
  height: 32px;
  width: 10%;
  margin-top: 4px;
  margin-right: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-radius: 50%;
  color: #111;
  svg {
    height: 24px;
    width: 24px;
  }

  &:hover {
    color: #777;
  }
`;

const NameButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export default function RecipeBox({ _id, title, images, openModal }) {
  const { addRecipe, removeRecipe } = useContext(BagContext);
  const url = '/recipe/' + _id;
  const { bagRecipes } = useContext(BagContext);
  const [isSaved, setIsSaved] = useState(bagRecipes.includes(_id));

  const handleRecipeClick = () => {
    openModal();
  };

  const handleAddToBagClick = () => {
    if (isSaved) {
      removeRecipe(_id);
    } else {
      addRecipe(_id);
    }
  
    // Toggle the saved state
    setIsSaved(!isSaved);
  };

  return (
    <RecipeWrapper >
        <ImageWrapper image={images?.[0]} onClick={handleRecipeClick}></ImageWrapper>
        <NameButtonWrapper>
            <NameWrapper onClick={handleRecipeClick}>{title}</NameWrapper>
            <ButtonWrapper>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={isSaved ? "#FF3040" : "none"} // Fill with red if saved, else no fill
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke={isSaved ? "#FF3040" : "currentColor"} // Red color if saved, else current color
                className="w-6 h-6"
                onClick={handleAddToBagClick}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </ButtonWrapper>
          </NameButtonWrapper>
    </RecipeWrapper>
  );
}
