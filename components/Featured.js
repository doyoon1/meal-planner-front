import styled from "styled-components";
import Center from "./Center";
import Button from "./Button";
import ButtonLink from "./ButtonLink";
import { useContext, useState, useRef, useEffect } from "react";
import { BagContext } from "./BagContext";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ImageModal from "./ImageModal";

const Bg = styled.div`
  background-color: #111;
  color: #fff;
  padding: 50px 0;
  position: relative;
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
  font-size: 0.6rem;
  text-overflow: ellipsis;
  @media screen and (min-width: 768px) {
    font-size: 0.8rem;
  }
`;

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  height: 400px; /* Set the desired height */
  transform: translate3d(0, 0, 0);
  img {
    max-width: 100%;
    max-height: 400px;
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

const DotsWrapper = styled.div`
  position: absolute;
  bottom: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    gap: 8px; /* Adjust the gap between dots */
  }

  button {
    width: 10px; /* Adjust the width of the dots */
    height: 10px; /* Adjust the height of the dots */
    border: none;
    background-color: #fff; /* Set the color of the dots */
    border-radius: 50%;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover,
    &.slick-active {
      background-color: #fff; /* Set the color of the active dot */
    }
  }
`;

export default function Featured({ recipes }) {
  const { addRecipe } = useContext(BagContext);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const sliderRef = useRef(null);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (sliderRef.current) {
  //       sliderRef.current.slickNext();
  //     }
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, []);

  function addFeaturedToBag(recipeId) {
    addRecipe(recipeId);
  }

  const openModal = (images) => {
    setModalImages(images);
    setModalIsOpen(true);
  };  

  useEffect(() => {
    const handleMouseWheel = (event) => {
      const delta = Math.max(-1, Math.min(1, event.deltaY));

      if (delta < 0) {
        // Scroll up, go to the previous slide
        sliderRef.current.slickPrev();
      } else {
        // Scroll down, go to the next slide
        sliderRef.current.slickNext();
      }

      // Stop the event propagation to prevent the page from scrolling
      event.stopPropagation();
      event.preventDefault();
    };

    const sliderContainer = document.getElementById("slider-container");

    if (sliderContainer) {
      sliderContainer.addEventListener("wheel", handleMouseWheel, { passive: false });
    }

    return () => {
      if (sliderContainer) {
        sliderContainer.removeEventListener("wheel", handleMouseWheel);
      }
    };
  }, []); 

  const settings = {
    dots: false,
    infinite: false,
    speed: 1200,
    slidesToShow: 1,
    slidesToScroll: 1,
    appendDots: (dots) => (
      <DotsWrapper>
        <ul style={{ margin: "0", padding: "0" }}>{dots}</ul>
      </DotsWrapper>
    ),
  };

  return (
    <div id="slider-container">
        <Slider {...settings} ref={sliderRef}>
          {recipes &&
            recipes.map((recipe) => (
              <Bg key={recipe._id}>
                <Center>
                  <ColumnsWrapper>
                    <Column>
                      <div>
                        <Title>{recipe.title}</Title>
                        <Description>{recipe.description}</Description>
                        <ButtonsWrapper>
                          <ButtonLink href={`/recipe/${recipe._id}`} outline={1} white={1}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                            </svg>
                            Learn more
                          </ButtonLink>
                          <Button white onClick={() => addFeaturedToBag(recipe._id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                              <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
                            </svg>
                            Save to bag
                          </Button>
                        </ButtonsWrapper>
                      </div>
                    </Column>
                    <Column>
                    <img src={recipe.images?.[0]} alt="" onClick={() => openModal(recipe.images)} />
                    </Column>
                  </ColumnsWrapper>
                </Center>
              </Bg>
            ))}
        </Slider>
      {modalIsOpen && <ImageModal isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)} images={modalImages} />}
    </div>
  );
}
