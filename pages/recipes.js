import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import { mongooseConnect } from "@/lib/mongoose";
import { Recipe } from "@/models/Recipe";
import RecipesGrid from "@/components/RecipesGrid";
import SearchBar from "@/components/RecipeSearch";
import { useState, useContext } from "react";
import SideWindow from "@/components/SideWindow";
import ScrollToTopButton from "@/components/ScrollToTop";
import { Pagination } from 'antd';
import { useRouter } from 'next/router';
import { BagContext } from "@/components/BagContext";

const Title = styled.h2`
    font-size: 2.5rem;
    margin: 10px 0 20px;
    font-weight: 500;
`;

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

const StyledPagination = styled(Pagination)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
  padding: 10px;
  border-radius: 8px;
  font-family: 'Poppins, sans-serif';

  .ant-pagination-prev, .ant-pagination-next {
    .ant-pagination-item-link {
      display: flex;
      justify-content: center;
      align-items: center;
      background: #fff;
      border: 1px solid #222; 
      border-radius: 4px; 
      color: #111;
      font-size: 12px;
      font-weight: bold;

      &:hover {
        background: #111 !important;
        border: 1px solid #111 !important;
        color: #fff !important;
      }
    }
  }

  .ant-pagination-item {
    background: #fff; 
    border: 1px solid #222;
    font-size: 12px;
    border-radius: 4px;
    font-weight: bold;

    &.ant-pagination-item-active {
      background: #222;
      border: 1px solid #222;
      border-radius: 4px;
      color: #fff;
    }

    &:not(.ant-pagination-item-active):hover {
      background: #222 !important;
      border: 1px solid #fff !important;
      color: #fff !important;
    }
  }
`;

const BagLength = styled.span`
  font-size: 10px;
  position: absolute;
  height: 8px;
  width: 8px;
  top: -5px;
  right: -5px;
  background-color: #FF0126;
  color: #fff;
  padding: 5px;
  border-radius: 50%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RecipesPage = ({ recipes, query, totalPages, currentPage }) => {
  const [isSideWindowOpen, setIsSideWindowOpen] = useState(false);
  const router = useRouter();
  const {bagRecipes} = useContext(BagContext);

  const toggleSideWindow = () => {
    setIsSideWindowOpen(!isSideWindowOpen);
  };

  const mainContentStyle = {
    marginRight: isSideWindowOpen ? '400px' : '0',
    transition: 'margin-right 0.5s',
  };

  const handlePageChange = (page) => {
    router.push({
      pathname: '/recipes',
      query: { ...router.query, page },
    });
  };

  return (
    <>
      <div style={mainContentStyle}>
        <Header />
        <SearchBar initialValue={query} />
        <Center>
          {query ? <Title></Title> : <Title>All recipes</Title>}
          <RecipesGrid recipes={recipes} />
          <StyledPagination
            current={currentPage}
            total={totalPages * 15}
            pageSize={15}
            onChange={handlePageChange}
            size="medium"
            showSizeChanger={false}
            itemRender={(current, type, element) => {
              // Display only up to 3 pagination numbers
              if (type === 'page') {
                if (current === currentPage || Math.abs(current - currentPage) <= 1 || current === 1 || current === totalPages) {
                  return (
                    <span className={currentPage === current ? 'custom-hover' : ''}>
                      {current}
                    </span>
                  );
                } else if (Math.abs(current - currentPage) === 2) {
                  // Display ellipsis (...) for skipped pages
                  return <span>...</span>;
                }
              }
              return element;
            }}
          />
        </Center>
        <ScrollToTopButton />
      </div>
      <SideWindow isOpen={isSideWindowOpen} onClose={toggleSideWindow} />
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
          <>
              {bagRecipes.length > 0 && (
                <BagLength>
                  {bagRecipes.length}
                </BagLength>
              )}
            <Icon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 004.25 22.5h15.5a1.875 1.875 0 001.865-2.071l-1.263-12a1.875 1.875 0 00-1.865-1.679H16.5V6a4.5 4.5 0 10-9 0zM12 3a3 3 0 00-3 3v.75h6V6a3 3 0 00-3-3zm-3 8.25a3 3 0 106 0v-.75a.75.75 0 011.5 0v.75a4.5 4.5 0 11-9 0v-.75a.75.75 0 011.5 0v.75z" clipRule="evenodd" />
            </Icon>
          </>
        )}
      </IconButtons>
    </>
  );
};

export async function getServerSideProps({ query }) {
  await mongooseConnect();

  const page = parseInt(query.page) || 1;
  const recipesPerPage = 15;
  const skip = (page - 1) * recipesPerPage;

  const { query: searchQuery = '' } = query;

  let recipes;
  let totalRecipes;

  if (searchQuery) {
    recipes = await Recipe.find({
      $or: [
        { title: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } },
      ],
    })
      .skip(skip)
      .limit(recipesPerPage)
      .exec();
    
    totalRecipes = await Recipe.countDocuments({
      $or: [
        { title: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } },
      ],
    });
  } else {
    recipes = await Recipe.find({}, null, { sort: { _id: -1 } })
      .skip(skip)
      .limit(recipesPerPage)
      .exec();

    totalRecipes = await Recipe.countDocuments();
  }

  const totalPages = Math.ceil(totalRecipes / recipesPerPage);

  return {
    props: {
      recipes: JSON.parse(JSON.stringify(recipes)),
      query: searchQuery,
      totalPages,
      currentPage: page,
    },
  };
}

export default RecipesPage;