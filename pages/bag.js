import { BagContext } from "@/components/BagContext";
import Center from "@/components/Center";
import Header from "@/components/Header";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import BagTable from "@/components/BagTable";

const ColumnsWrapper = styled.div`
    display: grid;
    gap: 10px;
    margin-top: 40px;
`;

const Box = styled.div`
    background-color: #fff;
    border-radius: 10px;
    padding: 30px;
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
                        <h2>Recipe Bag</h2>
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
                                </tr>
                            ))}
                            </tbody>
                        </BagTable>
                        )}
                    </Box>
                </ColumnsWrapper>
            </Center>
        </>
    );
}