import React, { useState, useEffect } from "react";
import styled from "styled-components";

const BigImage = styled.img`
    width: 100%;
    height: 30.12vw; /* Adjust the height as needed */
    object-fit: cover; /* Make the image cover the entire container */
    background-position: center center; /* Center the image */
`;

export default function RecipeImages({ images }) {
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            // Calculate the index of the next image
            const nextIndex = (activeImageIndex + 1) % images.length;
            setActiveImageIndex(nextIndex);
        }, 3000); // Change image every 3 seconds (adjust as needed)

        // Cleanup the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [activeImageIndex, images]);

    return (
        <>
                <BigImage src={images[activeImageIndex]} alt="" />
        </>
    );
}
