import { mongooseConnect } from '@/lib/mongoose';
import mongoose from 'mongoose';
import { UserAccounts } from '@/models/User';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await mongooseConnect(); // Connect to MongoDB

      const { email, password } = req.body;

      // Validate input fields
      if (!email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      // Check if the email exists
      const user = await UserAccounts.findOne({ email });

      if (!user) {
        return res.status(400).json({ error: 'Email or password is incorrect' });
      }

      // Check if the password is correct
      const passwordOk = bcrypt.compareSync(password, user.password);

      if (!passwordOk) {
        return res.status(400).json({ error: 'Email or password is incorrect' });
      }

      // Close the MongoDB connection
      await mongoose.connection.close();

      // Send a success response with user data
      res.status(200).json({ message: 'Login successful', user: { email: user.email, firstName: user.firstName, lastName: user.lastName } });
    } catch (error) {
      // Handle errors
      console.error('Error in login process:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}