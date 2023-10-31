import { useRouter } from "next/router";
import Link from "next/link";
import styled from "styled-components";
import Center from "./Center";
import { useContext, useState, useEffect } from "react";
import { BagContext } from "./BagContext";
import BagIcon from "./icons/BagIcon";
import HamburgerIcon from "./icons/Hamburger";
import axios from "axios";

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

const Dropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownLabel = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #aaa;
  justify-content: space-between;
`;

const Icon = styled.span`
    display: flex;
    align-items: center;

  svg {
    width: 15px;
    height: 15px;
}
`;


const DropdownContent = styled.div`
  display: ${(props) => (props.visible ? "block" : "none")};
  position: absolute;
  background-color: #111;
  min-width: 160px;
  z-index: 1;
  border: 1px solid #eee;
`;

const DropdownItem = styled.a`
  color: #aaa;
  text-decoration: none;
  display: block;
  padding: 10px;

  &:hover {
    background-color: #333;
    transition: all .3s ease;
  }
`;

export default function Header() {
    const {bagRecipes} = useContext(BagContext);
    const [mobileNavActive, setMobileNavActive] = useState(false);
    const [categoryDropdownVisible, setCategoryDropdownVisible] = useState(false);
    const [categories, setCategories] = useState([])
    const router = useRouter();

    const toggleCategoryDropdown = () => {
        setCategoryDropdownVisible(!categoryDropdownVisible);
    };

    const fetchCategories = async () => {
        try {
          const response = await axios.get("/api/categories");
          const coursesCategoryId = "653e5850ec031412f6316f77"; 
          const filteredCategories = response.data.filter((category) => {
            const categoryParentId = category.parent ? category.parent.toString() : null;
            
            return categoryParentId === coursesCategoryId;
          });
          setCategories(filteredCategories);
        } catch (error) {
          console.error('Error fetching categories:', error);
        }
      };
      
    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div>
            <StyledHeader>
                <Center>
                    <Wrapper>
                        <Logo href={'/'}>MealGrub</Logo>
                            <StyledNav mobileNavActive={mobileNavActive}>
                                <NavLink href={'/'} isActive={router.pathname === '/'}>Home</NavLink>
                                <NavLink href={'/recipes'} isActive={router.pathname === '/recipes'}>Recipes</NavLink>
                                <NavLink href={'/categories'} isActive={router.pathname === '/categories'}>Categories</NavLink>
                                <Dropdown
                                    onMouseEnter={toggleCategoryDropdown}
                                    onMouseLeave={toggleCategoryDropdown}
                                >
                                <DropdownLabel onClick={toggleCategoryDropdown}>
                                    Courses
                                    <Icon>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                        <path fillRule="evenodd" d="M4.72 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L11.69 12 4.72 5.03a.75.75 0 010-1.06zm6 0a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06L17.69 12l-6.97-6.97a.75.75 0 010-1.06z" clipRule="evenodd" />
                                    </svg>
                                    </Icon>
                                </DropdownLabel>
                                <DropdownContent visible={categoryDropdownVisible}>
                                    {categories.map((category) => {
                                        const categoryURL = '/category/' + category._id;
                                        return (
                                            <DropdownItem key={category._id} href={categoryURL}>
                                                {category.name}
                                            </DropdownItem>
                                        );
                                    })}
                                </DropdownContent>
                                </Dropdown>
                                <NavLink href={'/bag'} isActive={router.pathname === '/bag'}>
                                    <BagInfo>
                                    <BagIconContainer>
                                        <BagIcon />
                                    </BagIconContainer>
                                    ({bagRecipes.length})
                                    </BagInfo>
                                </NavLink>
                                <NavLink href={'/signup'} isActive={router.pathname === '/signup'}>Sign up</NavLink>
                                <NavLink href={'/signin'} isActive={router.pathname === '/signin'}>Sign in</NavLink>
                            </StyledNav>
                            <NavButton onClick={() => setMobileNavActive(prev => !prev)}>
                                <HamburgerIcon />
                            </NavButton>
                    </Wrapper>
                </Center>
            </StyledHeader>
        </div>
    );
}