import { createContext, useEffect, useState } from "react";

export const BagContext = createContext({});

export function BagContextProvider({ children }) {
  const ls = typeof window !== "undefined" ? window.localStorage : null;
  const [bagRecipes, setBagRecipes] = useState([]);

  useEffect(() => {
    if (ls && ls.getItem('bag')) {
      setBagRecipes(JSON.parse(ls.getItem('bag')));
    }
  }, [ls]);

  useEffect(() => {
    if (bagRecipes?.length > 0) {
      ls?.setItem('bag', JSON.stringify(bagRecipes));
    } else {
      ls?.removeItem('bag'); // Remove the 'bag' item from local storage if bag is empty
    }
  }, [bagRecipes, ls]);

  function addRecipe(recipeId) {
    if (!bagRecipes.includes(recipeId)) {
      setBagRecipes((prev) => [...prev, recipeId]);
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
