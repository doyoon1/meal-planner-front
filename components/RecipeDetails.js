import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useRef } from "react";
import { BagContext } from "./BagContext";
import { useContext } from "react";
import PlannerModal from "./PlannerModal";

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  display: flex;
  height: 340px;
  background-color: #fff;
  padding: 20px;
  max-width: 70%;
  text-align: center;
  box-shadow: 0 2px 2.2px rgba(0, 0, 0, 0.034), 0 6.7px 5.3px rgba(0, 0, 0, 0.048);
  position: relative;
`;

const LeftColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LargeImage = styled.img`
  height: 250px;
  width: 100%;
  border-radius: 4px;
  object-fit: contain; /* Use 'cover' or 'contain' based on your preference */
`;


const SmallImages = styled.div`
  display: flex;
  margin-top: 10px;
  cursor: pointer;

  img {
    height: 50px;
    width: auto;
    margin-right: 10px;
    border: 2px solid transparent;
    border-radius: 4px;
    transition: border-color 0.2s;

    &:hover {
      border-color: #007BFF;
    }
  }
`;

const RightColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 20px;
  justify-content: space between;
  flex-grow: 1;
`;

const ModalButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 20px;
`;

const AddToBag = styled.a`
  display: flex;
  flex-direction: column;
  font-size: 14px;
  align-items: center;
  text-transform: uppercase;
  color: #444;
  border: none;
  cursor: pointer;
  margin: 0 10px;
  text-decoration: none;

  svg {
    width: 18px;
    height: 18px;
    margin-right: 8px; /* Adjust the margin as needed */
  }

  &:hover {
    color: #F5533D;
    svg {
      color: #111;
      fill: #F5533D;
      transition: all 0.3s ease;
    }
  }
`;

const SeeBag = styled.a`
display: flex;
  flex-direction: column;
  font-size: 14px;
  align-items: center;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  text-decoration: none;  
  color: #F5533D;

  svg {
    width: 18px;
    height: 18px;
    margin-right: 8px; /* Adjust the margin as needed */
    fill: #F5533D;
  }

  &:hover {
    svg {
      color: #111;
    }
  }
`;

const ModalButtons = styled.a`
  display: flex;
  flex-direction: column;
  font-size: 14px;
  align-items: center;
  text-transform: uppercase;
  color: #444;
  border: none;
  cursor: pointer;
  margin: 0 10px;
  text-decoration: none;

  svg {
    width: 18px;
    height: 18px;
    margin-right: 8px; /* Adjust the margin as needed */
  }

  &:hover {
    color: #F5533D;
    svg {
      color: #111;
      fill: #F5533D;
      transition: all 0.3s ease;
    }
  }
`;

const CloseButton = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 20px;
  height: 20px;
  width: 20px;
  color: #FF3040;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 30px;
  text-align: left;
  line-height: 1.3;
`;

const Description = styled.p`
  font-size: 14px;
  margin: 0;
  text-align: left;
  margin-top: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Servings = styled.p`
  font-size: 14px;
  text-align: left;
  margin: 0;
  margin-top: 10px;
  font-weight: 500;
`;

function RecipeModal({ isOpen, closeModal, recipe }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const { bagRecipes, addRecipe, removeRecipe } = useContext(BagContext);
  const url = '/recipe/' + recipe?._id;
  const isRecipeInBag = bagRecipes?.includes(recipe?._id);
  const MAX_DESCRIPTION_WORDS = 40;
  const [plannerModalIsOpen, setPlannerModalIsOpen] = useState(false);

  const togglePlannerModal = () => {
    setPlannerModalIsOpen(!plannerModalIsOpen);
  };

  function truncateDescription(description) {
    const words = description.split(' ');
    if (words.length <= MAX_DESCRIPTION_WORDS) {
      return description;
    } else {
      return words.slice(0, MAX_DESCRIPTION_WORDS).join(' ') + '...';
    }
  }

  const modalRef = useRef();

  useEffect(() => {
    if (isOpen) {
      setSelectedImage(recipe?.images?.[0]);
    }
  }, [isOpen, recipe?.images]);

  const handleBackgroundClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeModal();
    }
  }; 

  const handleToggleSaveToBag = () => {
    if (isRecipeInBag) {
      // If the recipe is in the bag, remove it
      removeRecipe(recipe._id);
    } else {
      // If the recipe is not in the bag, add it
      addRecipe(recipe._id);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <ModalBackground onClick={handleBackgroundClick}>
      <ModalContent ref={modalRef}>
        <CloseButton onClick={closeModal}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
          </svg>
        </CloseButton>
        <LeftColumn>
          <LargeImage src={selectedImage} alt="" />
          <SmallImages>
            {recipe.images?.map((image, index) => (
              <img
                key={index}
                src={image}
                alt=""
                onClick={() => setSelectedImage(image)}
                style={{ border: image === selectedImage ? "2px solid #007BFF" : "2px solid transparent" }}
              />
            ))}
          </SmallImages>
        </LeftColumn>
        <RightColumn>
          <Title>{recipe.title}</Title>
          <Description>{truncateDescription(recipe.description)}</Description>
          <Servings>Servings: {recipe.servings}</Servings>
          <ModalButtonsWrapper>
            <ModalButtons href={url} target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
              </svg>
              Learn more
            </ModalButtons>
            <AddToBag onClick={handleToggleSaveToBag}>
              {isRecipeInBag ? (
                <SeeBag>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM20.25 5.507v11.561L5.853 2.671c.15-.043.306-.075.467-.094a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93zM3.75 21V6.932l14.063 14.063L12 18.088l-7.165 3.583A.75.75 0 013.75 21z" />
                  </svg>
                     Already Saved
                </SeeBag>
              ) : (
                <ModalButtons>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
                  </svg>
                    Save to Bag
                </ModalButtons>
              )}
            </AddToBag>
            <ModalButtons onClick={togglePlannerModal}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
              </svg>
              Add to planner
            </ModalButtons>
          </ModalButtonsWrapper>
        </RightColumn>
      </ModalContent>
      {plannerModalIsOpen && (
        <>
          <ModalBackground onClick={(e) => e.stopPropagation()}>
            <PlannerModal 
            isOpen={plannerModalIsOpen} 
            closeModal={togglePlannerModal}
            recipe={recipe} />
          </ModalBackground>
        </>
      )}
    </ModalBackground>
  );
}

export default RecipeModal;
