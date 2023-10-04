import { createContext, useEffect, useState } from "react";

export const BagContext = createContext({});

export function BagContextProvider({children}) {
    const ls = typeof window !== "undefined" ? window.localStorage : null;
    const [bagRecipes, setBagRecipes] = useState([]);
    useEffect(() => {
        if (bagRecipes?.length > 0) {
            ls?.setItem('bag', JSON.stringify(bagRecipes));
        }
    }, [bagRecipes]);
    useEffect(() => {
        if (ls && ls.getItem('bag')) {
            setBagRecipes(JSON.parse(ls.getItem('bag')));
        } 
    }, []);
    function addRecipe(recipeId) {
        if (!bagRecipes.includes(recipeId)) {
            setBagRecipes(prev => [...prev, recipeId]);
        }    
    }

    return (
        <BagContext.Provider value={{bagRecipes,setBagRecipes,addRecipe}}>
            {children}
        </BagContext.Provider>

    );
}