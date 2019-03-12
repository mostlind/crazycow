import styled from "styled-components";
import { colors, fontSizes } from "../styles";

export const H1 = styled.h1`
  margin: 0;
  padding: 0;
  color: ${colors.darkGrey};
  font-size: ${fontSizes.large};
  font-weight: normal;
`;

export const H2 = styled.h2`
  margin: 0;
  padding: 0;
  color: ${props => (props.color ? props.color : colors.darkGrey)};
  font-size: ${fontSizes.medium};
  font-weight: normal;
`;

export const P = styled.p`
  margin: 0;
  padding: 0;
  color: ${colors.darkGrey};
  font-size: ${fontSizes.small};
`;
