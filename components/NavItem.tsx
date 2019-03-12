import React, { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { unit, shadow, navHeight } from "../styles";

export interface NavItemProps {
  route: string;
  icon: ReactNode;
}

const StyledLink = styled(NavLink)`
  padding-left: ${unit(5)};
  padding-right: ${unit(5)};
  padding-top: calc(${navHeight} / 4);
  padding-bottom: calc(${navHeight} / 4);
  & > svg {
    height: calc(${navHeight} / 2);
    width: calc(${navHeight} / 2);
  }
  &.active > svg {
    filter: drop-shadow(${shadow.glowPurple});
  }
`;

export function NavItem({ route, icon }: NavItemProps) {
  return <StyledLink to={route}>{icon}</StyledLink>;
}
