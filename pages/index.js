import React, { useState } from "react";
import Header from "@/components/Header";
import Featured from "@/components/Featured";
import { Recipe } from "@/models/Recipe";
import { mongooseConnect } from "@/lib/mongoose";
import NewRecipes from "@/components/NewRecipes";
import SearchBar from "@/components/SearchBar";
import SideWindow from "@/components/SideWindow";
import styled from "styled-components";
import ScrollToTopButton from "@/components/ScrollToTop";

const IconButtons = styled.div`
  width: 40px;
  height: 40px;
  position: fixed;
  top: ${(props) => (props.isSideWindowOpen ? "300px" : "300px")};
  right: ${(props) => (props.isSideWindowOpen ? "405px" : "55px")};
  z-index: 999;
  background-color: #fff;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: top 0.5s, right 0.5s; 
`;

const Icon = styled.svg`
  width: 20px;
  height: 20px;
`;

export default function HomePage({ featuredRecipes, newRecipes }) {
  const [isSideWindowOpen, setIsSideWindowOpen] = useState(false);

  const toggleSideWindow = () => {
    setIsSideWindowOpen(!isSideWindowOpen);
  };

  const mainContentStyle = {
    marginRight: isSideWindowOpen ? "400px" : "0",
    transition: "margin-right 0.5s",
  };

  return (
    <div>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap"
        rel="stylesheet"
      />
      <div style={mainContentStyle}>
        <Header />
        <Featured recipes={featuredRecipes} />
        <SearchBar />
        <NewRecipes recipes={newRecipes} />
        <ScrollToTopButton />
      </div>
      <SideWindow isOpen={isSideWindowOpen} onClose={toggleSideWindow}>
        <p>Side Window Content</p>
      </SideWindow>
      <IconButtons
        className="icon-button"
        onClick={toggleSideWindow}
        isSideWindowOpen={isSideWindowOpen}
      >
        {isSideWindowOpen ? (
          <Icon xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </Icon>
          ) : (
          <Icon xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-calendar-filled" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M16 2a1 1 0 0 1 .993 .883l.007 .117v1h1a3 3 0 0 1 2.995 2.824l.005 .176v12a3 3 0 0 1 -2.824 2.995l-.176 .005h-12a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-12a3 3 0 0 1 2.824 -2.995l.176 -.005h1v-1a1 1 0 0 1 1.993 -.117l.007 .117v1h6v-1a1 1 0 0 1 1 -1zm3 7h-14v9.625c0 .705 .386 1.286 .883 1.366l.117 .009h12c.513 0 .936 -.53 .993 -1.215l.007 -.16v-9.625z" stroke-width="0" fill="currentColor" />
            <path d="M12 12a1 1 0 0 1 .993 .883l.007 .117v3a1 1 0 0 1 -1.993 .117l-.007 -.117v-2a1 1 0 0 1 -.117 -1.993l.117 -.007h1z" stroke-width="0" fill="currentColor" />          
          </Icon>
        )}
      </IconButtons>
    </div>
  );
}

export async function getServerSideProps() {
  await mongooseConnect();

  // Query MongoDB to find featured recipes with "featured" field set to true
  const featuredRecipes = await Recipe.find({ featured: true });

  if (!featuredRecipes || featuredRecipes.length === 0) {
    return {
      notFound: true, 
    };
  }

  const newRecipes = await Recipe.find({}, null, { sort: { _id: -1 }, limit: 6 });

  return {
    props: {
      featuredRecipes: JSON.parse(JSON.stringify(featuredRecipes)),
      newRecipes: JSON.parse(JSON.stringify(newRecipes)),
    },
  };
}