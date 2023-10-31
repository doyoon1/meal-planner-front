import { mongooseConnect } from "@/lib/mongoose";
import Recipe from "@/models/Recipe";

export default async function handler(req, res) {
  await mongooseConnect();

  if (req.method === 'GET') {
    try {
      const { categoryId } = req.query;
      const recipes = await Recipe.find({ category: categoryId }).exec();
      res.status(200).json(recipes);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch recipes' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
