import { mongooseConnect } from '@/lib/mongoose';
import { Recipe } from '@/models/Recipe';
import Header from '@/components/Header';
import RecipesGrid from '@/components/RecipesGrid';
import Category from '@/models/Category';
import Center from '@/components/Center';

export default function CategoryPage({ category, recipes }) {
    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap" rel="stylesheet" />
            <Header />
            <Center>
              <div>
                  <h1>{category?.name} Recipes</h1>
                  <RecipesGrid recipes={recipes} />
              </div>
            </Center>
        </>
    );
}

export async function getServerSideProps(context) {
    await mongooseConnect();
    const { id } = context.query;

    // Fetch the category based on the categoryId
    const category = await Category.findById(id); // Make sure to import and define Category model

    // Fetch recipes based on the category ID
    const recipes = await Recipe.find({ category: id }).populate('category').exec();

    return {
        props: {
            category: JSON.parse(JSON.stringify(category)),
            recipes: JSON.parse(JSON.stringify(recipes)),
        },
    };
}
