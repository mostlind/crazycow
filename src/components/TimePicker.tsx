import React, { useState } from "react";
import { unit, colors, fontSizes, shadow, zLayers } from "../styles";
import styled from "styled-components";
import { P } from "./base";
import { SelectInput } from "./SelectInput";
import { If } from "./If";
import { Time, twentyFourToTwelve, formatTime } from "../models/Meal";

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

const TimeFields = styled.div`
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

const range = (start: number, end: number) =>
  Array.from(new Array(end - start)).map((_, index) => index + start);

const InputRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  :not(:last-child) {
    margin-bottom: ${unit(2)};
  }
`;

const InputLabel = styled(P)`
  margin-right: ${unit(2)};
  width: 75%;
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
  cursor: pointer;
`;

const hourOptions = range(1, 13).map(val => ({
  value: val,
  display: String(val)
}));

const minuteOptions = [0, 10, 20, 30, 40, 50].map(val => ({
  display: val === 0 ? "00" : String(val),
  value: val
}));

const amPmOptions = [
  {
    display: "am",
    value: false
  },
  {
    display: "pm",
    value: true
  }
];

const floorTo10 = (amount: number) => Math.floor(amount / 10) * 10;

const createTime = (hours: number, minutes: number, isPm: boolean): Time => ({
  hours: isPm ? hours + 12 : hours,
  minutes
});

interface TimePickerProps {
  initial: Time;
  onInput: (time: Time) => void;
}

export function TimePicker({ initial, onInput }: TimePickerProps) {
  const [hours, setHours] = useState(twentyFourToTwelve(initial.hours));
  const [minutes, setMinutes] = useState(floorTo10(initial.minutes));
  const [isPm, setIsPm] = useState(initial.hours >= 12 ? true : false);
  const [showFields, setShowFields] = useState(false);

  return (
    <Container
      onClick={e => {
        if (e.target === e.currentTarget) {
          setShowFields(!showFields);
        }
      }}
    >
      {formatTime(createTime(hours, minutes, isPm))}
      <If predicate={showFields}>
        {() => (
          <TimeFields>
            <InputRow>
              <InputLabel>Hours</InputLabel>
              <SelectInput
                options={hourOptions}
                initial={hours - 1}
                onInput={newHours => {
                  onInput(createTime(newHours, minutes, isPm));
                  setHours(newHours);
                }}
              />
            </InputRow>
            <InputRow>
              <InputLabel>Minutes</InputLabel>
              <SelectInput
                options={minuteOptions}
                initial={minutes / 10}
                onInput={newMinutes => {
                  onInput(createTime(hours, newMinutes, isPm));
                  setMinutes(newMinutes);
                }}
              />
            </InputRow>
            <InputRow>
              <InputLabel>AM/PM</InputLabel>
              <SelectInput
                options={amPmOptions}
                initial={isPm ? 1 : 0}
                onInput={newIsPm => {
                  onInput(createTime(hours, minutes, newIsPm));
                  setIsPm(newIsPm);
                }}
              />
            </InputRow>
            <DoneButton onClick={() => setShowFields(false)}>Done</DoneButton>
          </TimeFields>
        )}
      </If>
    </Container>
  );
}
