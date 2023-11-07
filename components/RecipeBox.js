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
  border-radius: 4px;

  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center; /* Center the image horizontally */
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
    transform: scale(1.05);
    background-color: #F0F2F5;
  }
`;

const NameButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export default function RecipeBox({ _id, title, images, openModal }) {
  const { addRecipe } = useContext(BagContext);
  const url = '/recipe/' + _id;


  const handleRecipeClick = () => {
    openModal();
  };
  
  return (
    <RecipeWrapper >
        <ImageWrapper image={images?.[0]} onClick={handleRecipeClick}></ImageWrapper>
        <NameButtonWrapper>
            <NameWrapper onClick={handleRecipeClick}>{title}</NameWrapper>
            <ButtonWrapper>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M10.5 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clipRule="evenodd" />
                </svg>
            </ButtonWrapper>
        </NameButtonWrapper>
    </RecipeWrapper>
  );
}
