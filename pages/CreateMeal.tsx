import React, { useMemo, useState } from "react";
import { TextInput } from "../components/TextInput";
import { Card } from "../components/Card";
import { SelectInput } from "../components/SelectInput";
import { H2, P } from "../components/base";
import styled from "styled-components";
import { unit, colors, shadow, fontSizes, navHeight } from "../styles";
import { DatePicker } from "../components/DatePicker";
import { TimePicker } from "../components/TimePicker";
import { Time } from "../models/Meal";
import { MealRepo } from "../repositories/Meals";
import { DayRepo } from "../repositories/Days";
import { amounts, Amount } from "../models/Amount";
import { Redirect } from "react-router";
import { Location } from "history";

const floorTo10 = (amount: number) => Math.floor(amount / 10) * 10;

const roundTime = ({ hours, minutes }: Time): Time => ({
  hours,
  minutes: floorTo10(minutes)
});

const timeFromDate = (date: Date): Time => ({
  hours: date.getMinutes() > 50 ? date.getHours() + 1 : date.getHours(),
  minutes: Math.floor(date.getMinutes() / 10)
});

const parseQueryString = (queryString: string): { [key: string]: string } => {
  const dropQuestionMark = queryString.slice(1);
  const queryKVPairs = dropQuestionMark.split("&");
  const keyValObjects = queryKVPairs
    .map(x => x.split("="))
    .map(([key, val]) => ({ [key]: decodeURIComponent(val) }));

  return keyValObjects.reduce((a, b) => Object.assign(a, b), {});
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% - ${navHeight});
  width: 100%;
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  :not(:last-child) {
    margin-bottom: ${unit(2)};
  }
`;

const InputLabel = styled(P)`
  width: 33%;
`;

const Header = styled(H2)`
  margin-bottom: ${unit(1)};
`;

const SubmitButton = styled.button`
  border: none;
  background-color: ${colors.purple};
  color: ${colors.white};
  padding: ${unit(1)} ${unit(2)};
  align-self: flex-end;
  font-size: ${fontSizes.small};
  box-shadow: ${shadow.drop};
  cursor: pointer;
`;

const amountOptions = [
  "None (0%)",
  "Some (25%)",
  "Half (50%)",
  "Most (75%)",
  "All (100%)"
]
  .map((val, index) => ({
    value: amounts[index],
    display: val
  }))
  .reverse();

interface CreateMealProps {
  mealRepo: MealRepo;
  dayRepo: DayRepo;
  history: History;
  location: Location;
}

export function CreateMeal({ mealRepo, dayRepo }: CreateMealProps) {
  const queryParams = useMemo(() => parseQueryString(location.search), [
    location.search
  ]);

  const today = useMemo(() => new Date(), []);
  const [date, setDate] = useState(
    queryParams.date ? new Date(queryParams.date) : today
  );
  const [time, setTime] = useState(
    roundTime(
      queryParams.time ? JSON.parse(queryParams.time) : timeFromDate(today)
    )
  );
  const [amount, setAmount] = useState(null as Amount | null);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [dayId, setDayId] = useState(null as null | number);

  const submit = async () => {
    setSubmitted(true);
    if (amount === null) {
      return;
    }

    const day = await dayRepo.findOrCreate(date);

    if (!day.id) {
      console.error("couldnt create day", { day });
      return;
    }

    const meal = await mealRepo.create({
      time,
      notes,
      amount
    });

    await dayRepo.update(
      day.id,
      time.hours > 12 ? { eveningMeal: meal } : { morningMeal: meal }
    );

    setDayId(day.id);
  };

  if (dayId) {
    return <Redirect to={"/day/" + dayId} />;
  }

  return (
    <Container>
      <Header>Create Meal</Header>
      <Card title="Select">
        <InputRow>
          <InputLabel>Date</InputLabel>
          <DatePicker initial={date} onInput={setDate} />
        </InputRow>
        <InputRow>
          <InputLabel>Time</InputLabel>
          <TimePicker initial={time} onInput={setTime} />
        </InputRow>
      </Card>
      <Card title="Amount">
        <SelectInput
          options={amountOptions}
          onInput={amount => {
            setAmount(amount);
            setSubmitted(false);
          }}
          isValid={!submitted || amount !== null}
        />
      </Card>
      <Card title="Notes">
        <TextInput placeholder="Notes..." onInput={setNotes} />
      </Card>
      <SubmitButton
        type="button"
        onClick={() => {
          submit();
        }}
      >
        Submit
      </SubmitButton>
    </Container>
  );
}
