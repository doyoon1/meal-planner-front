import React, { useState } from "react";
import styled from "styled-components";

const WindowContainer = styled.div`
  position: fixed;
  top: 0;
  right: ${(props) => (props.isOpen ? "0" : "-390px")};
  width: 390px;
  height: 100%;
  background-color: #fff;
  transition: right 0.5s;
  box-shadow: ${(props) => (props.isOpen ? "5px 0 20px rgba(0, 0, 0, 0.5)" : "none")};
  z-index: 999;
  padding: 20px 0;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  text-align: center;
  margin: 10px 0;
  color: #111;
`;

const Content = styled.div`
  position: absolute;
  top: 40%;
  left: 20%;
  transform: translate(-50%, -50%);
  color: #111;
`;


const DayList = styled.ul`
  list-style: none;
  padding: 0;
  background-color: #eee;
`;

const DayListItem = styled.li`
  margin-bottom: 20px;
  font-weight: bold;
  color: #aaa;
`;


const SideWindow = ({ isOpen, children }) => {
  return (
    <WindowContainer isOpen={isOpen}>
      <Title>Meal Planner</Title>
      <Content>
        <DayList>
          <DayListItem>MONDAY</DayListItem>
          <DayListItem>TUESDAY</DayListItem>
          <DayListItem>WEDNESDAY</DayListItem>
          <DayListItem>THURSDAY</DayListItem>
          <DayListItem>FRIDAY</DayListItem>
          <DayListItem>SATURDAY</DayListItem>
          <DayListItem>SUNDAY</DayListItem>
        </DayList>
      </Content>
    </WindowContainer>
  );
};

export default SideWindow;
