import React, { useState, useEffect } from "react";
import styled from "styled-components";
import backArrow from "../assets/back-arrow.svg";
import { Link } from "react-router-dom";
import { unit, colors } from "../styles";
import { H2, P, H1 } from "./base";
import { months } from "../util";
import { If } from "./If";
import { Card } from "./Card";
import { Meal, formatTime, Time } from "../models/Meal";
import { DayRepo } from "../repositories/Days";
import { Day } from "../models/Day";
import { Placeholder } from "./Placeholder";

const monthAndDay = (date: Date) =>
  `${months[date.getMonth()]} ${date.getDate()}`;

const mapPercentToColor: { [key: string]: string } = {
  "0%": colors.red,
  "25%": colors.orange,
  "50%": colors.yellow,
  "75%": colors.yellowGreen,
  "100%": colors.green
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PercentContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
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

const monthDayYear = (date: Date) =>
  `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

const Header = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: ${unit(1)};
`;

const Back = styled(Link)`
  padding-right: ${unit(2)};
`;

const MealNotes = styled(P)`
  margin-top: ${unit(1)};
`;

interface MealDetailProps {
  meal: Meal;
}

function MealDetail({ meal: { amount, notes, time } }: MealDetailProps) {
  return (
    <>
      <Container>
        <PercentContainer>
          <Indicator color={mapPercentToColor[amount.percent]} />
          <Percentage>{amount.percent}</Percentage>
        </PercentContainer>
        <H2>{formatTime(time)}</H2>
      </Container>
      <If predicate={notes !== ""}>{() => <MealNotes>{notes}</MealNotes>}</If>
    </>
  );
}

interface MealPlaceholderProps {
  date: Date;
  time: Time;
  title: string;
}

function MealPlaceHolder({ date, time, title }: MealPlaceholderProps) {
  const encodedDate = encodeURIComponent(date.toISOString());
  const encodedTime = encodeURIComponent(JSON.stringify(time));
  return (
    <Link to={`/new?date=${encodedDate}&time=${encodedTime}`}>
      <Placeholder title={title} />
    </Link>
  );
}

interface DayDetailProps {
  id: number;
  dayRepo: DayRepo;
}

export function DayDetail({ id, dayRepo }: DayDetailProps) {
  const [day, setDay] = useState(null as Day | null);
  useEffect(() => {
    dayRepo.findById(id).then(day => setDay(day));
  }, []);

  return (
    <If predicate={day !== null}>
      {() => (
        <>
          <Header>
            <Back to="/home">
              <img src={backArrow} />
            </Back>
            <H2>{monthDayYear(day!.date)}</H2>
          </Header>
          <If predicate={day!.morningMeal !== null}>
            {() => (
              <Card title="Morning">
                <MealDetail meal={day!.morningMeal!} />
              </Card>
            )}
          </If>
          <If predicate={day!.morningMeal === null}>
            {() => (
              <MealPlaceHolder
                title="Morning Meal"
                date={day!.date}
                time={{
                  hours: 9,
                  minutes: 0
                }}
              />
            )}
          </If>
          <If predicate={day!.eveningMeal !== null}>
            {() => (
              <Card title="Evening">
                <MealDetail meal={day!.eveningMeal!} />
              </Card>
            )}
          </If>
          <If predicate={day!.eveningMeal === null}>
            {() => (
              <MealPlaceHolder
                title="Evening Meal"
                date={day!.date}
                time={{
                  hours: 17,
                  minutes: 0
                }}
              />
            )}
          </If>
          <If predicate={day!.notes !== ""}>
            {() => (
              <Card title="Notes">
                <P>{day!.notes}</P>
              </Card>
            )}
          </If>
        </>
      )}
    </If>
  );
}
