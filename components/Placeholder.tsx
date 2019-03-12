import React from "react";
import styled from "styled-components";
import { shadow, colors, unit } from "../styles";
import { H2 } from "./base";

const Container = styled.div`
  margin-bottom: ${unit(2)};
`;

const Header = styled.div`
  border: dashed ${colors.midGrey} ${unit(0.5)};
  display: flex;
  padding: ${unit(0.5)} ${unit(2)};
  display: flex;
  justify-content: space-between;
`;

interface PlaceholderProps {
  title: string;
}

export function Placeholder({ title }: PlaceholderProps) {
  return (
    <Container>
      <Header>
        <H2 color={colors.midGrey}>{title}</H2>
      </Header>
    </Container>
  );
}
