import styled from "styled-components";
import Center from "./Center";
import Button from "./Button";
import ButtonLink from "./ButtonLink";
import { useContext, useState } from "react";
import { BagContext } from "./BagContext";
import ImageModal from "./ImageModal"; 

const Bg = styled.div`
    background-color: #111;
    color: #fff;
    padding: 50px 0;
`;

const Title = styled.h1`
    margin: 0;
    font-weight: normal;
    font-size: 1.5rem;
    @media screen and (min-width: 768px) {
        font-size: 3rem;
    }
`;

const Description = styled.p`
    color: #aaa;
    font-size: .6rem;
    text-overflow: ellipsis;
    @media screen and (min-width: 768px) {
        font-size: .8rem;
    }
`;

const ColumnsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
    img {
        max-width: 100%;
        max-height: 200px;
        border-radius: 8px;
        display: block;
        margin: 0 auto;
    }
    div:nth-child(1) {
        order: 2;
    }
    @media screen and (min-width: 768px) {
        grid-template-columns: 1.1fr 0.9fr;
        div:nth-child(1) {
            order: 0;
        }
        img {
            max-width: 100%;
            border-radius: 8px;
            max-height: 400px;
        }
    }
`;

const Column = styled.div`
    display: flex;
    align-items: center;
`;

const ButtonsWrapper = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 25px;
`;

export default function Featured({ recipe }) {
    const { addRecipe } = useContext(BagContext);
  
    // State for the modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
    // Open the modal
    const openModal = (index) => {
      setSelectedImageIndex(index);
      setIsModalOpen(true);
    };
  
    // Close the modal
    const closeModal = () => {
      setIsModalOpen(false);
    };
  
    function addFeaturedToBag() {
      addRecipe(recipe._id);
    }
  
    return (
      <>
        <Bg>
          <Center>
            <ColumnsWrapper>
              <Column>
                <div>
                  <Title>{recipe.title}</Title>
                  <Description>{recipe.description}</Description>
                  <ButtonsWrapper>
                    <ButtonLink href={'/recipe/'+recipe._id} outline={1} white={1}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                        </svg>
                            Learn more
                        </ButtonLink>
                        <Button white onClick={addFeaturedToBag}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
                        </svg>
                            Save to bag
                        </Button>
                    </ButtonsWrapper>
                </div>
              </Column>
              <Column>
                {/* Clickable image to open the modal */}
                <img
                  src={recipe.images?.[0]}
                  alt=""
                  onClick={() => openModal(0)}
                />
              </Column>
            </ColumnsWrapper>
          </Center>
        </Bg>
  
        {/* ImageModal component */}
        <ImageModal
          isOpen={isModalOpen}
          onClose={closeModal}
          images={recipe.images}
          initialIndex={selectedImageIndex}
        />
      </>
    );
}