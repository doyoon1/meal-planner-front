import { useRouter } from "next/router";
import Link from "next/link";
import styled from "styled-components";
import Center from "./Center";
import { useContext, useState, useEffect } from "react";
import { BagContext } from "./BagContext";
import BagIcon from "./icons/BagIcon";
import HamburgerIcon from "./icons/Hamburger";
import axios from "axios";
import CoursesDropdown from "./Dropdown";

const StyledHeader = styled.header`
    background-color: #111;
`;

const Logo = styled(Link)`
    color:#fff;
    text-decoration: none;
    position: relative;
    z-index: 3;
`;

const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 20px 0;
`;

const StyledNav = styled.nav`
    ${props => props.mobileNavActive ? `
        display: block;
    ` : `
        display: none;
    `}
    gap: 10px;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 70px 20px 20px;
    background-color: #111;
    @media screen and (min-width: 768px) {
        display: flex;
        position: static;
        padding: 0;
    }
`;

const NavLink = styled(Link)`
    display: block;
    color: #aaa;
    text-decoration: none;
    &:hover {
        color: #fff;
        transition: all .4s;
    }
    ${(props) => props.isActive && `color: #fff;`}
    padding: 5px 0;
    @media screen and (min-width: 768px) {
        padding: 0;
    }
`;

const BagInfo = styled.div`
    display: flex; 
    align-items: center;
    font-size: 14px;
`;

const BagIconContainer = styled.div`
    width: 24px;
`;

const NavButton = styled.button`
    background-color: transparent;
    width: 40px;
    height: 30px;
    border: 0;
    cursor: pointer;
    color: white;
    position: relative;
    z-index: 3;
    @media screen and (min-width: 768px) {
        display: none;
    }
`;

export default function Header() {
    const { bagRecipes } = useContext(BagContext);
    const router = useRouter();
    const [coursesCategories, setCoursesCategories] = useState([]);
    const [dietaryCategories, setDietaryCategories] = useState([]);

    useEffect(() => {
    const fetchDietaryCategories = async () => {
        try {
        const response = await axios.get("/api/categories");
        const dietaryParentId = "653e62ebec031412f6316fb6";

        const filteredDietaryCategories = response.data.filter((category) => {
            return category.parent === dietaryParentId;
        });

        setDietaryCategories(filteredDietaryCategories);
        } catch (error) {
        console.error('Error fetching dietary categories:', error);
        }
    };

    fetchDietaryCategories();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
        try {
            const response = await axios.get("/api/categories");
            const coursesCategoryId = "653e5850ec031412f6316f77";
            
            // Filter categories with "coursesCategoryId" as their parent
            const filteredCategories = response.data.filter((category) => {
            return category.parent === coursesCategoryId;
            });

            setCoursesCategories(filteredCategories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
        };

        fetchCategories();
    }, []);
  
    return (
      <div>
        <StyledHeader>
          <Center>
            <Wrapper>
              <Logo href={"/"}>MealGrub</Logo>
              <StyledNav>
                <NavLink href={"/"} isActive={router.pathname === "/"}>
                  Home
                </NavLink>
                <NavLink
                  href={"/recipes"}
                  isActive={router.pathname === "/recipes"}
                >
                  Recipes
                </NavLink>
                <NavLink
                  href={"/categories"}
                  isActive={router.pathname === "/categories"}
                >
                  Categories
                </NavLink>
                <CoursesDropdown categories={coursesCategories} label="Courses" />
                <CoursesDropdown categories={dietaryCategories} label="By Diet" />
                <NavLink href={"/bag"} isActive={router.pathname === "/bag"}>
                  <BagInfo>
                    <BagIconContainer>
                      <BagIcon />
                    </BagIconContainer>
                    ({bagRecipes.length})
                  </BagInfo>
                </NavLink>
                <NavLink href={"/signup"} isActive={router.pathname === "/signup"}>
                  Sign up
                </NavLink>
                <NavLink href={"/signin"} isActive={router.pathname === "/signin"}>
                  Sign in
                </NavLink>
              </StyledNav>
              <NavButton onClick={() => setMobileNavActive((prev) => !prev)}>
                <HamburgerIcon />
              </NavButton>
            </Wrapper>
          </Center>
        </StyledHeader>
      </div>
    );
  }