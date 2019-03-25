import React from "react";
import { Card } from "../components/Card";
import { Day } from "../models/Day";
import styled from "styled-components";
import { MealSummary } from "./MealSummary";
import { If } from "./If";
import { H2, P } from "./base";
import { Link } from "react-router-dom";
import { months } from "../util";

const monthAndDay = (date: Date) =>
  `${months[date.getMonth()]} ${date.getDate()}`;

const MealSummariesContainer = styled.div`
  display: flex;
  justify-content: space-around;
`;

const MealSummaryContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

interface DayProps {
  day: Day;
}

export function DaySummary({
  day: { id, notes, morningMeal, eveningMeal, date }
}: DayProps) {
  return (
    <Link to={`/day/${id}`}>
      <Card title={monthAndDay(date)}>
        <MealSummariesContainer>
          <If predicate={morningMeal !== null}>
            {() => (
              <MealSummaryContainer>
                <H2>Morning</H2>
                <MealSummary meal={morningMeal!} />
              </MealSummaryContainer>
            )}
          </If>
          <If predicate={eveningMeal !== null}>
            {() => (
              <MealSummaryContainer>
                <H2>Evening</H2>
                <MealSummary meal={eveningMeal!} />
              </MealSummaryContainer>
            )}
          </If>
        </MealSummariesContainer>
        <If predicate={notes !== ""}>{() => <P>{notes}</P>}</If>
      </Card>
    </Link>
  );
}
