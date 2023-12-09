import { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

export const BagContext = createContext({});

export function BagContextProvider({ children }) {
  const { data: session } = useSession();
  const [bagRecipes, setBagRecipes] = useState([]);

  useEffect(() => {
    // Fetch the initial bag data when the component mounts
    if (session) {
      axios.get(`/api/bag?userId=${session.user._id}`)
        .then(response => {
          setBagRecipes(response.data.bag);
        })
        .catch(error => {
          console.error('Error fetching user bag:', error);
        });
    }
  }, [session]);

  function manageRecipe(action, recipeId) {
    if (!session) {
      console.error('User not logged in.');
      return;
    }

    const userId = session.user._id;

    axios.post('/api/bag', { userId, recipeId, action }, { withCredentials: true })
      .then(response => {
        // Handle success if needed
        // Fetch the updated bag data after successful update
        axios.get(`/api/bag?userId=${userId}`)
          .then(response => {
            setBagRecipes(response.data.bag);
          })
          .catch(error => {
            console.error('Error fetching updated bag data:', error);
          });
      })
      .catch(error => {
        // Handle error if needed
        console.error('Error managing recipe in bag:', error);
      });
  }

  function addRecipe(recipeId) {
    manageRecipe('add', recipeId);
  }

  function removeRecipe(recipeId) {
    manageRecipe('remove', recipeId);
  }

  return (
    <BagContext.Provider value={{ bagRecipes, setBagRecipes, addRecipe, removeRecipe }}>
      {children}
    </BagContext.Provider>
  );
}