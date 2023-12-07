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

    // Check if the recipeId is not already in the bag
    if (!user.bag.includes(recipeId)) {
      user.bag.push(recipeId);
      await user.save();
    }

    return res.status(200).json({ message: 'Recipe added to the bag successfully' });
  } catch (error) {
    console.error('Error updating bag:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
