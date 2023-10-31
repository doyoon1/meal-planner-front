import styled from "styled-components";
import Button from "./Button";
import { useContext } from "react";
import { BagContext } from "./BagContext";


const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
`;

const CloseButton = styled(Button)`
  position: absolute;
  top: 10px;
  right: 10px;
`;

export default function RecipeDetails({ recipe, onClose }) {
    return (
      <ModalOverlay>
        <ModalContent>
          <CloseButton onClick={onClose}>Close</CloseButton>
          <h2>{recipe.title}</h2>
          <p>{recipe.description}</p>
          {/* Add more recipe details here */}
        </ModalContent>
      </ModalOverlay>
    );
  }