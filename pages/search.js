import { useRouter } from "next/router";
import SearchBar from "@/components/SearchBar";
import { Recipe } from "@/models/Recipe";
import { mongooseConnect } from "@/lib/mongoose";
import Header from "@/components/Header";
import Center from "@/components/Center";
import SearchResults from "@/components/SearchResults";

export default function SearchPage({ recipes, query }) {
  const router = useRouter();

  return (
    <div>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap" rel="stylesheet"/>

        <Header />
        <SearchBar initialValue={query} /> {/* Pass the query as initialValue */}
        <Center>
            <h1>Search Results for "{query}"</h1>
            <SearchResults recipes={recipes} />
        </Center>
    </div>
  );
}

export async function getServerSideProps({ query }) {
  const { query: searchQuery } = query;

  await mongooseConnect();

  try {
    const titleResults = await Recipe.find({
      title: { $regex: searchQuery, $options: "i" },
    });
    const ingredientResults = await Recipe.find({
      "ingredients.name": { $regex: searchQuery, $options: "i" },
    });

    // Combine title and ingredient results
    let recipes = [...titleResults, ...ingredientResults];

    // Use a Set to remove duplicates
    const recipeSet = new Set(recipes.map((recipe) => JSON.stringify(recipe)));
    recipes = Array.from(recipeSet).map((recipeStr) => JSON.parse(recipeStr));

    return {
      props: {
        recipes,
        query: searchQuery, // Pass the query as a prop
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        recipes: [],
        query: searchQuery, // Pass the query even in case of an error
      },
    };
  }
}
