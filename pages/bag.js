import { BagContext } from "@/components/BagContext";
import Center from "@/components/Center";
import Header from "@/components/Header";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import BagTable from "@/components/BagTable";
import Plan from "@/components/Plan";

const ColumnsWrapper = styled.div`
    display: grid;
    gap: 10px;
    grid-template-columns: 1fr;
    margin-top: 40px;
    @media screen and (min-width: 768px) {
        grid-template-columns: .8fr 1.2fr;
    }
            
`;

const Box = styled.div`
    background-color: #fff;
    border-radius: 10px;
    padding: 30px;
`;

const More = styled.button`
    background-color: #E5E7EB; // Change to your desired background color
    color: #4B5563;
    border: none;
    padding: 5px 10px;
    border-radius: 2px;
    cursor: pointer;
    margin-right: 4px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 20px;

    svg {
        fill: #000; 
        width: 18px;
        height: 18px;
    }


    &:hover {
        background-color: #c9c9c9;
        color: #111;
        transition: background-color 0.3s ease-in-out;
    }
`;

export default function BagPage () {
    const {bagRecipes} = useContext(BagContext);
    const [recipes, setRecipes] = useState([]);
    useEffect(() => {
        if (bagRecipes.length > 0) {
            axios.post('/api/bag', {ids:bagRecipes})
            .then(response => {
                setRecipes(response.data);
            })
        }
    }, [bagRecipes]);
    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap" rel="stylesheet"/>
            <Header />
            <Center>
                <ColumnsWrapper>
                    <Box>
                        <h2>Grocery Bag</h2>
                        {!bagRecipes?.length && (
                            <div>Your grocery bag is empty</div>
                        )}
                        {recipes?.length > 0 && (

                        <BagTable>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody>
                            {recipes.map(recipe => (
                                <tr>
                                    <td>{recipe.title}</td>
                                    <td>
                                    <More>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                        </svg>
                                    </More>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </BagTable>
                        )}
                    </Box>
                    <Box>
                        <Plan />
                    </Box>
                </ColumnsWrapper>
            </Center>
        </>
    );
}