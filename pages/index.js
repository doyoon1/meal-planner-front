import Header from "@/components/Header";
import Featured from "@/components/Featured";
import { Recipe } from "@/models/Recipe";
import { mongooseConnect } from "@/lib/mongoose";
import NewRecipes from "@/components/NewRecipes";

export default function HomePage({featuredRecipe, newRecipes}) {
  return (
    <div>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap" rel="stylesheet"/>
      <Header />
      <Featured recipe={featuredRecipe} />
      <NewRecipes recipes={newRecipes} />
    </div>
  );
}

export async function getServerSideProps() {
  const featuredRecipeId = '651d6e71998c15e700e5cf33';
  await mongooseConnect();
  const featuredRecipe = await Recipe.findById(featuredRecipeId);
  const newRecipes = await Recipe.find({}, null, {sort: {'_id':-1}, limit:12});
  return {
    props: {
      featuredRecipe: JSON.parse(JSON.stringify(featuredRecipe)),
      newRecipes: JSON.parse(JSON.stringify(newRecipes)),
    },
  };
}