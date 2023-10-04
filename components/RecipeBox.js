import styled from "styled-components";
import Button from "./Button";
import Link from "next/link";
import { useContext } from "react";
import { BagContext } from "./BagContext";

const RecipeWrapper = styled.div`
`;

const WhiteBox = styled(Link)`
    padding: 0; /* Remove padding to let the image fill the box */
    height: 180px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    overflow: hidden; /* Ensure the image doesn't overflow the box */
    position: relative; /* To position the image correctly */

    /* Set the image as the background */
    background-image: url(${props => props.image});
    background-size: cover; /* Make the image cover the box */
    background-position: center center; /* Center the image */

    /* Add box-shadow to the box */
    box-shadow: 0 2px 2.2px rgba(0, 0, 0, 0.034),
                0 6.7px 5.3px rgba(0, 0, 0, 0.048);

    /* Add hover effect */
    transition: transform 0.2s ease-in-out;
    
    &:hover {
        transform: scale(0.95); /* Zoom out a bit on hover */
    }
    
    /* Hide the name by default */
    .name {
        font-weight: normal;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0, 0, 0, 0.7);
        color: #ccc;
        padding: 8px 12px;
        white-space: nowrap;
        overflow: hidden; /* Hide overflowing text */
        text-overflow: ellipsis; /* Display ellipsis (...) for overflowed text */
    }
`;

const ButtonWrapper = styled.div`
    margin-top: 10px; 
    transition: transform 0.2s ease-in-out;
    &:hover {
        transform: scale(1.05);
    }
`;

export default function RecipeBox({_id, title, description, images}) {
    const { addRecipe } = useContext(BagContext);
    const url = '/recipe/' + _id;
    return (
        <RecipeWrapper>
            {/* Pass the images prop to WhiteBox */}
            <WhiteBox href={url} image={images?.[0]}>
                {/* Add the name with a class */}
                <div className="name">{title}</div>
            </WhiteBox>
            <ButtonWrapper>
                <Button onClick={() => addRecipe(_id)} block primary outline>
                    Add to bag
                </Button>
            </ButtonWrapper>
        </RecipeWrapper>
    );
}