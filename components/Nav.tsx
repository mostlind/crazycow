import styled from "styled-components";
import { colors, shadow, navHeight } from "../styles";

export const Nav = styled.div`
  width: 100%;
  background-color: ${colors.white};
  display: flex;
  justify-content: center;
  position: fixed;
  top: calc(100vh - ${navHeight});
  box-shadow: ${shadow.nav};
`;
