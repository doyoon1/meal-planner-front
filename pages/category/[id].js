import { mongooseConnect } from '@/lib/mongoose';
import { Recipe } from '@/models/Recipe';
import Header from '@/components/Header';
import RecipesGrid from '@/components/RecipesGrid';
import Category from '@/models/Category';
import Center from '@/components/Center';
import styled from 'styled-components';

const CategoryTitle = styled.h1`
  font-size: 2.5rem;
  margin: 30px 0 20px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RecipeCount = styled.p`
  font-size: 1.2rem;
  margin: 0;
  color: #777; /* You can choose the color you prefer */
`;

export default function CategoryPage({ category, recipes }) {
    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap" rel="stylesheet" />
            <Header />
            <Center>
              <div>
                  <CategoryTitle>
                      {category?.name}
                      <RecipeCount>{`${recipes.length} recipes`}</RecipeCount>
                  </CategoryTitle>
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
    const category = await Category.findById(id); // Make sure to import and define the Category model

    // Fetch recipes based on the category ID
    const recipes = await Recipe.find({ category: id }).populate('category').exec();

    return {
        props: {
            category: JSON.parse(JSON.stringify(category)),
            recipes: JSON.parse(JSON.stringify(recipes)),
        },
    };
}
