import { useRouter } from "next/router";
import Link from "next/link";
import styled from "styled-components";
import Center from "./Center";
import { useState, useEffect } from "react";
import HamburgerIcon from "./icons/Hamburger";
import axios from "axios";
import CoursesDropdown from "./Dropdown";
import { signOut, useSession } from "next-auth/react";

const StyledHeader = styled.header`
    background-color: #111;
`;

const Logo = styled(Link)`
    color: #fff;
    text-decoration: none;
    position: relative;
    z-index: 3;
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    img{
      height: 64px;
      width: 64px;
    }
`;

const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 20px 0;
    align-items: center;
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

const ButtonsWrapper = styled.div`
    display: flex;
    gap: 10px;
`;

const Logout = styled.button`
  display: block;
  color: #aaa;
  text-decoration: none;
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  padding: 5px 0;
  
  &:hover {
    color: #fff;
    transition: all .4s;
  }

  @media screen and (min-width: 768px) {
    padding: 0;
  }
`;

export default function Header() {
    const router = useRouter();
    const [mainCourses, setMainCourses] = useState([])
    const [coursesCategories, setCoursesCategories] = useState([]);
    const [dietaryCategories, setDietaryCategories] = useState([]);
    const [mobileNavActive, setMobileNavActive] = useState(false);
    const session = useSession();
    const status = session.status;

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

    useEffect(() => {
      const mainCourses = async () => {
      try {
          const response = await axios.get("/api/categories");
          const mainCoursesCategoryId = "6581153849e5aa1bbc820d9b";
          
          // Filter categories with "coursesCategoryId" as their parent
          const filteredMainCategories = response.data.filter((category) => {
          return category.parent === mainCoursesCategoryId;
          });

          setMainCourses(filteredMainCategories);
      } catch (error) {
          console.error('Error fetching categories:', error);
      }
      };

      mainCourses();
  }, []);

    return (
      <div>
        <StyledHeader mobileNavActive={mobileNavActive}>
          <Center>
            <Wrapper>
              <Logo href={"/"}>
                MealGrub
              </Logo>
              <StyledNav>
                <NavLink href={"/home"} isActive={router.pathname === "/home"}>
                  Home
                </NavLink>
                <NavLink
                  href={"/recipes"}
                  isActive={router.pathname === "/recipes"}
                >
                  Recipes
                </NavLink>
                <NavLink
                  href={"/planner"}
                  isActive={router.pathname === "/planner"}
                >
                  Planner
                </NavLink>
                <CoursesDropdown categories={mainCourses} label="Main Courses" />
                <CoursesDropdown categories={coursesCategories} label="Courses" />
                <CoursesDropdown categories={dietaryCategories} label="By Diet" />
                <ButtonsWrapper>
                  {status === 'authenticated' && (
                    <>
                      <NavLink href={'/profile'}>Profile</NavLink>
                      <Logout
                        onClick={() => signOut()}>
                        Logout
                      </Logout>
                    </>
                  )}
                  {status === 'unauthenticated' && (
                    <>
                      <NavLink href={"/login"} isActive={router.pathname === "/login"}>
                        Login
                      </NavLink>
                      <NavLink href={"/register"} isActive={router.pathname === "/register"}>
                        Register
                      </NavLink>
                    </>
                  )}
                </ButtonsWrapper>
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