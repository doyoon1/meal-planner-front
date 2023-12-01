import mongoose from "mongoose";
import { mongooseConnect } from "@/lib/mongoose";
import { UserAccounts } from "@/models/User";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await mongooseConnect(); // Connect to MongoDB

      const body = req.body; // Use req.body to access JSON data

      // Create user
      const createdUser = await UserAccounts.create(body);

      // Close the MongoDB connection
      await mongoose.connection.close();

      // Send response
      res.status(200).json({ message: 'User created successfully' });
    } catch (error) {
      // Handle errors
      console.error('Error in registration process:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
