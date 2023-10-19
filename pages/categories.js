import Center from "@/components/Center"
import Header from "@/components/Header"
import styled from "styled-components";

const Title = styled.h2`
    font-size: 1.8rem;
    margin: 30px 0 20px;
    font-weight: 500;
`;

export default function CategoriesPage() {
    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap" rel="stylesheet"/>
            <Header />
            <Center>
                <Title>Categories</Title>
            </Center>
        </>
    )
}