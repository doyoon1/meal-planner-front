import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import { mongooseConnect } from "@/lib/mongoose";
import { Recipe } from "@/models/Recipe";
import RecipesGrid from "@/components/RecipesGrid";
import SearchBar from "@/components/RecipeSearch";
import { useRouter } from "next/router";
import Link from "next/link";

const Title = styled.h2`
    font-size: 2.5rem;
    margin: 10px 0 20px;
    font-weight: 500;
`;

export default function RecipesPage({ recipes, query }) {
    const router = useRouter();
  
    return (
      <>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <Header />
        <SearchBar initialValue={query} />
        <Center>
            {query ? <Title></Title> : <Title>All recipes</Title>}
            <RecipesGrid recipes={recipes} />
      </Center>
      </>
    );
  }
  

  export async function getServerSideProps({ query }) {
    await mongooseConnect();
  
    // Fetch recipes based on the query parameter in the URL
    const { query: searchQuery = "" } = query; // Provide a default value
  
    let recipes;
  
    if (searchQuery) {
      // If a search query is provided, filter recipes based on the search query
      recipes = await Recipe.find({
        // Adjust this query as needed to match your data model
        // You might want to search in title, description, or other fields
        $or: [
          { title: { $regex: searchQuery, $options: "i" } },
          { description: { $regex: searchQuery, $options: "i" } },
        ],
      });
    } else {
      // If no search query is provided, fetch all recipes
      recipes = await Recipe.find({}, null, { sort: { _id: -1 } });
    }
  
    return {
      props: {
        recipes: JSON.parse(JSON.stringify(recipes)),
        query: searchQuery,
      },
    };
  }
  