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
    fill: #FF3040;
    transform: scale(1.1);
  }
`;

const NameButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export default function RecipeBox({ _id, title, images, openModal }) {
  const { bagRecipes, addRecipe, removeRecipe } = useContext(BagContext);
  const url = '/recipe/' +_id;
  const isRecipeInBag = bagRecipes.includes(_id);

  const handleRecipeClick = () => {
    openModal();
  };

  const handleAddToBagClick = () => {
    if (isRecipeInBag) {
      removeRecipe(_id);
    } else {
      addRecipe(_id);
    }
  };

  return (
    <RecipeWrapper >
        <ImageWrapper image={images?.[0]} onClick={handleRecipeClick}></ImageWrapper>
        <NameButtonWrapper>
            <NameWrapper onClick={handleRecipeClick}>{title}</NameWrapper>
            <ButtonWrapper>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={isRecipeInBag ? "#222" : "none"} 
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke={isRecipeInBag ? "#222" : "currentColor"} 
                className="w-6 h-6"
                onClick={handleAddToBagClick}
              >
                <path strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" 
                />
              </svg>
            </ButtonWrapper>
          </NameButtonWrapper>
    </RecipeWrapper>
  );
}
