import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import { mongooseConnect } from "@/lib/mongoose";
import { Recipe } from "@/models/Recipe";
import RecipesGrid from "@/components/RecipesGrid";
import SearchBar from "@/components/RecipeSearch";
import { useState } from "react";
import SideWindow from "@/components/SideWindow";
import ScrollToTopButton from "@/components/ScrollToTop";
import { Pagination } from 'antd';
import { useRouter } from 'next/router';

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
  background-color: #F0F2F5;
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

const RecipesPage = ({ recipes, query, totalPages, currentPage }) => {
  const [isSideWindowOpen, setIsSideWindowOpen] = useState(false);
  const router = useRouter();

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
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap"
        rel="stylesheet"
      />
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
      <SideWindow isOpen={isSideWindowOpen} onClose={toggleSideWindow}>
        <p>Side Window Content</p>
      </SideWindow>
      <IconButtons
        className="icon-button"
        onClick={toggleSideWindow}
        isSideWindowOpen={isSideWindowOpen}
      >
        {isSideWindowOpen ? (
          <Icon
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </Icon>
        ) : (
          <Icon
            xmlns="http://www.w3.org/2000/svg"
            class="icon icon-tabler icon-tabler-calendar-filled"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="#2c3e50"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path
              d="M16 2a1 1 0 0 1 .993 .883l.007 .117v1h1a3 3 0 0 1 2.995 2.824l.005 .176v12a3 3 0 0 1 -2.824 2.995l-.176 .005h-12a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-12a3 3 0 0 1 2.824 -2.995l.176 -.005h1v-1a1 1 0 0 1 1.993 -.117l.007 .117v1h6v-1a1 1 0 0 1 1 -1zm3 7h-14v9.625c0 .705 .386 1.286 .883 1.366l.117 .009h12c.513 0 .936 -.53 .993 -1.215l.007 -.16v-9.625z"
              stroke-width="0"
              fill="currentColor"
            />
            <path
              d="M12 12a1 1 0 0 1 .993 .883l.007 .117v3a1 1 0 0 1 -1.993 .117l-.007 -.117v-2a1 1 0 0 1 -.117 -1.993l.117 -.007h1z"
              stroke-width="0"
              fill="currentColor"
            />
          </Icon>
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