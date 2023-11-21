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
  width: 16px;
  height: 16px;
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
          <Icon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
          </Icon>
          ) : (
          <Icon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 004.25 22.5h15.5a1.875 1.875 0 001.865-2.071l-1.263-12a1.875 1.875 0 00-1.865-1.679H16.5V6a4.5 4.5 0 10-9 0zM12 3a3 3 0 00-3 3v.75h6V6a3 3 0 00-3-3zm-3 8.25a3 3 0 106 0v-.75a.75.75 0 011.5 0v.75a4.5 4.5 0 11-9 0v-.75a.75.75 0 011.5 0v.75z" clipRule="evenodd" />
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