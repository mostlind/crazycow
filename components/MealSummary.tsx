import React from "react";
import { Meal } from "../models/Meal";
import { H1 } from "./base";
import styled from "styled-components";
import { colors, unit } from "../styles";
import notesIcon from "../assets/notes-icon.svg";

const mapPercentToColor: { [key: string]: string } = {
  "0%": colors.red,
  "25%": colors.orange,
  "50%": colors.yellow,
  "75%": colors.yellowGreen,
  "100%": colors.green
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: ${unit(1)};
  margin-bottom: ${unit(1)};
`;
const Indicator = styled.div`
  height: ${unit(2)};
  width: ${unit(2)};
  background-color: ${({ color }) => color};
  border-radius: ${unit(2)} ${unit(2)};
`;

const Percentage = styled(H1)`
  margin-left: ${unit(1.5)};
  margin-right: ${unit(1.5)};
`;

interface MealSummaryProps {
  meal: Meal;
}

export function MealSummary({ meal: { amount, notes } }: MealSummaryProps) {
  return (
    <Container>
      <Indicator color={mapPercentToColor[amount.percent]} />
      <Percentage>{amount.percent}</Percentage>
      {notes !== "" ? (
        <img style={{ height: unit(3) }} src={notesIcon} />
      ) : null}
    </Container>
  );
}
