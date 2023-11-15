import { mongooseConnect } from '@/lib/mongoose';
import { Recipe } from '@/models/Recipe';
import Header from '@/components/Header';
import RecipesGrid from '@/components/RecipesGrid';
import Category from '@/models/Category';
import Center from '@/components/Center';
import styled from 'styled-components';
import ScrollToTopButton from '@/components/ScrollToTop';
import { Pagination } from 'antd';
import { useState } from 'react';
import { useRouter } from 'next/router';

const CategoryTitle = styled.h1`
  font-size: 2.5rem;
  margin: 30px 0 20px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RecipeCount = styled.p`
  font-size: 1.2rem;
  margin: 0;
  color: #777; /* You can choose the color you prefer */
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

export default function CategoryPage({ category, recipes }) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    router.push({
      pathname: `/category/${category._id}`,
      query: { page },
    });
  };

  const recipesPerPage = 15;
  const totalRecipes = recipes.length;
  const totalPages = Math.ceil(totalRecipes / recipesPerPage);
  const startIndex = (currentPage - 1) * recipesPerPage;
  const endIndex = startIndex + recipesPerPage;
  const paginatedRecipes = recipes.slice(startIndex, endIndex);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap" rel="stylesheet" />
      <Header />
      <Center>
        <div>
          <CategoryTitle>
            {category?.name}
            <RecipeCount>{`${totalRecipes} recipes`}</RecipeCount>
          </CategoryTitle>
          <RecipesGrid recipes={paginatedRecipes} />
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
        </div>
      </Center>
      <ScrollToTopButton />
    </>
  );
}

export async function getServerSideProps(context) {
  await mongooseConnect();
  const { id } = context.query;

  // Fetch the category based on the categoryId
  const category = await Category.findById(id); // Make sure to import and define the Category model

  // Fetch recipes based on the category ID
  const recipes = await Recipe.find({ category: id }).populate('category').exec();

  return {
    props: {
      category: JSON.parse(JSON.stringify(category)),
      recipes: JSON.parse(JSON.stringify(recipes)),
    },
  };
}