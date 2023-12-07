import { mongooseConnect } from '@/lib/mongoose';
import { Recipe } from '@/models/Recipe';

mongooseConnect();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { bagRecipes } = req.body;

  try {
    // Fetch details for each recipe ID in the bag
    const bagDetails = await Promise.all(
      bagRecipes.map(async (recipeId) => {
        const recipe = await Recipe.findById(recipeId);
        return recipe ? recipe.toJSON() : null;
      })
    );

    return res.status(200).json(bagDetails.filter((recipe) => recipe !== null));
  } catch (error) {
    console.error('Error fetching bag details:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}