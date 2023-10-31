import Header from "@/components/Header";
import Featured from "@/components/Featured";
import { Recipe } from "@/models/Recipe";
import { mongooseConnect } from "@/lib/mongoose";
import NewRecipes from "@/components/NewRecipes";
import SearchBar from "@/components/SearchBar";

export default function HomePage({featuredRecipe, newRecipes}) {
  return (
    <div>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap" rel="stylesheet"/>
      <Header />
      <Featured recipe={featuredRecipe} />
      <SearchBar />
      <NewRecipes recipes={newRecipes} />
    </div>
  );
}

export async function getServerSideProps() {
  await mongooseConnect();

  // Query MongoDB to find the featured recipe with "featured" field set to true
  const featuredRecipe = await Recipe.findOne({ featured: true });

  if (!featuredRecipe) {
    return {
      notFound: true, // Handle the case where no featured recipe is found
    };
  }

  const newRecipes = await Recipe.find({}, null, { sort: { _id: -1 }, limit: 12 });
  return {
    props: {
      featuredRecipe: JSON.parse(JSON.stringify(featuredRecipe)),
      newRecipes: JSON.parse(JSON.stringify(newRecipes)),
    },
  };
}