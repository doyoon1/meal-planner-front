import { mongooseConnect } from '@/lib/mongoose';
import { UserAccounts } from '@/models/User';

mongooseConnect();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { userId, recipeId } = req.body;

  try {
    const user = await UserAccounts.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove the recipeId from the user's bag
    user.bag = user.bag.filter(id => id.toString() !== recipeId);

    await user.save();

    return res.status(200).json({ message: 'Recipe removed from the bag successfully' });
  } catch (error) {
    console.error('Error removing recipe from bag:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
