import React from 'react'
import styled from 'styled-components'
import Link from 'next/link';
import { useRouter } from 'next/router';
import Center from '@/components/Center';
import NavBar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Hero = styled.div`
  background-image: url("/pagebackground.png");
  background-size: cover;
  background-repeat: no-repeat;
  height: 605px;
  width: 100%;
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const HeroLogo = styled.h1`
  font-size: 150px;
  color: #fff;
  font-weight: bold;
  padding-top: 160px;
  margin: 0;
`;

const HeroLabel1 = styled.p`
  color: #fff;
  font-size: 32px;
  margin: 0;
  margin-top: -20px;
  font-family: 'Libre Baskerville', serif;
`;

const HeroLabel2 = styled.p`
  background-color: #fff;
  padding: 0 8px;
  border-radius: 8px;
  color: #111;
  font-size: 16px;
  margin-top: 20px;
  font-weight: 600;
`;

export default function index() {
  return (
    <>
      <NavBar />
      <Hero>
        <Center>
          <HeroLogo>MealGrub</HeroLogo>
          <HeroLabel1>Browse Over 500+ Filipino Recipes Nationwide!</HeroLabel1>
          <HeroLabel2>Countless delicious Filipino cuisines to try and cook for your Family and loved ones.</HeroLabel2>
        </Center>
      </Hero>
      <Footer />
    </>
  )
}
