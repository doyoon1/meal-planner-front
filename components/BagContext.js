import { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

export const BagContext = createContext({});

export function BagContextProvider({ user, children }) {
  const { data: session } = useSession();
  const [bagRecipes, setBagRecipes] = useState(user?.bag || []);

  function addRecipe(recipeId) {
    if (!session) {
      console.error('User not logged in.');
      // You can redirect to the login page or show a login prompt here
      return;
    }

    const userId = session.user._id;

    if (!bagRecipes.includes(recipeId)) {
      setBagRecipes((prev) => [...prev, recipeId]);

      // Save the updated bag to the database
      axios.post('/api/updateBag', { userId, recipeId }, { withCredentials: true })
        .then(response => {
          // Handle success if needed
        })
        .catch(error => {
          // Handle error if needed
          console.error('Error saving recipe to bag:', error);
        });
    }
  }

  function removeRecipe(recipeId) {
    setBagRecipes((prev) => prev.filter((id) => id !== recipeId));
  }

  return (
    <BagContext.Provider value={{ bagRecipes, setBagRecipes, addRecipe, removeRecipe }}>
      {children}
    </BagContext.Provider>
  );
}
