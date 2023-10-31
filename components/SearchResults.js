import styled from "styled-components";
import Center from "./Center";
import RecipesGrid from "./RecipesGrid";

export default function SearchResults({ recipes }) {
  return (
      <RecipesGrid recipes={recipes} />
  );
}
