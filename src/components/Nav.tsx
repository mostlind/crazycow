import styled from "styled-components";
import { colors, shadow, navHeight } from "../styles";

export const Nav = styled.div`
  width: 100%;
  background-color: ${colors.white};
  display: flex;
  justify-content: center;
  position: fixed;
  bottom: 0;
  box-shadow: ${shadow.nav};
`;
