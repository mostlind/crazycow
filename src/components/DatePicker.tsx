import React, { useState } from "react";
import { unit, colors, fontSizes, shadow, zLayers } from "../styles";
import styled from "styled-components";
import { P } from "./base";
import { SelectInput } from "./SelectInput";
import { months } from "../util";
import { setMonth, setYear, setMinutes } from "date-fns/esm";
import { If } from "./If";
import { setDate, setHours, startOfDay } from "date-fns";

const Container = styled.div`
  border: none;
  padding: ${unit(1)};
  padding-bottom: ${unit(0.5)};
  border-bottom: solid ${unit(0.5)} ${colors.purple};
  font-size: ${fontSizes.small};
  transition: background-color 100ms ease-out;
  border-radius: 0;
  position: relative;
  cursor: pointer;
  &:hover {
    background-color: ${colors.grey};
  }
`;

const DateFields = styled.div`
  position: absolute;
  top: calc(100% + ${unit(0.5)});
  right: 0;
  padding: ${unit(1.5)};
  min-width: 65vw;
  background-color: ${colors.white};
  box-shadow: ${shadow.drop};
  cursor: initial;
  z-index: ${zLayers.selectDropdown};
  -webkit-overflow-scrolling: touch;
`;

const formatDate = (date: Date) =>
  `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

const range = (start: number, end: number) =>
  Array.from(new Array(end - start)).map((_, index) => index + start);

const InputRow = styled.div`
  display: flex;
  align-items: center;
  :not(:last-child) {
    margin-bottom: ${unit(2)};
  }
`;

const InputLabel = styled(P)`
  margin-right: ${unit(2)};
  width: 45%;
`;

const DoneButton = styled.button`
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colors.purple};
  color: ${colors.white};
  padding: ${unit(1)};
  width: 100%;
  font-size: ${fontSizes.small};
  cursor: pointer;
`;

const monthOptions = months.map((month, index) => ({
  value: index,
  display: month
}));

const dayOptions = range(1, 32).map(val => ({
  display: String(val),
  value: val
}));

const year = new Date().getFullYear();

const yearOptions = range(year - 10, year + 1)
  .map(val => ({
    display: String(val),
    value: val
  }))
  .reverse();

const noop = () => {};

interface DatePickerProps {
  initial: Date;
  onInput: (date: Date) => void;
}

export function DatePicker({ initial, onInput = noop }: DatePickerProps) {
  const [selectedDate, setSelectedDate] = useState(startOfDay(initial));
  const [showFields, setShowFields] = useState(false);

  const updateDate = (date: Date) => {
    setSelectedDate(date);
    onInput(date);
  };

  return (
    <Container
      onClick={e => {
        if (e.target === e.currentTarget) {
          setShowFields(!showFields);
        }
      }}
    >
      {formatDate(selectedDate)}
      <If predicate={showFields}>
        {() => (
          <DateFields>
            <InputRow>
              <InputLabel>Month</InputLabel>
              <SelectInput
                options={monthOptions}
                initial={selectedDate.getMonth()}
                onInput={month => updateDate(setMonth(selectedDate, month))}
              />
            </InputRow>
            <InputRow>
              <InputLabel>Day</InputLabel>
              <SelectInput
                options={dayOptions}
                initial={selectedDate.getDate() - 1}
                onInput={day => updateDate(setDate(selectedDate, day))}
              />
            </InputRow>
            <InputRow>
              <InputLabel>Year</InputLabel>
              <SelectInput
                options={yearOptions}
                initial={yearOptions.findIndex(
                  ({ value }) => value === selectedDate.getFullYear()
                )}
                onInput={year => updateDate(setYear(selectedDate, year))}
              />
            </InputRow>
            <DoneButton onClick={() => setShowFields(false)}>Done</DoneButton>
          </DateFields>
        )}
      </If>
    </Container>
  );
}
