import styled from "styled-components";
import Center from "./Center";
import RecipesGrid from "./RecipesGrid";
import { useSession } from "next-auth/react";

export default function SearchResults({ recipes }) {
  const { data:session } = useSession();
  console.log("Session in Search results", session);

  return (
      <RecipesGrid recipes={recipes} session={session} />
  );
}
