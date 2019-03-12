import React, { useState, useEffect } from "react";

import styled from "styled-components";
import { unit, colors, fontSizes, shadow, zLayers } from "../styles";
import { If } from "./If";
import { P } from "./base";
import selectArrow from "../assets/select-arrow.svg";

const validationColor = ({ isValid }: { isValid: boolean }) =>
  isValid ? colors.purple : colors.red;

const Select = styled.div`
  border: none;
  background-color: ${colors.white};
  padding: ${unit(1)};
  padding-bottom: ${unit(0.5)};
  border-bottom: solid ${unit(0.5)} ${validationColor};
  width: 100%;
  font-size: ${fontSizes.small};
  position: relative;
  cursor: pointer;
  transition: background-color 100ms ease-out;
  &:hover {
    background-color: ${colors.grey};
  }
`;

const OptionsContainer = styled.div`
  position: absolute;
  top: calc(100% + ${unit(0.5)});
  right: 0;
  width: 100%;
  background-color: ${colors.white};
  box-shadow: ${shadow.drop};
  max-height: ${unit(20)};
  overflow-y: auto;
  z-index: ${zLayers.selectDropdown};
  -webkit-overflow-scrolling: touch;
`;

const Option = styled.div`
  padding: ${unit(1)};
  transition: background-color 100ms ease-out;
  &:hover {
    background-color: ${colors.grey};
  }
`;

const ChoiceContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

interface InputProps<T> {
  onInput: (value: T) => void;
  initial?: number;
  isValid?: boolean;
  options: {
    display: string;
    value: T;
  }[];
  className?: string;
}

export function SelectInput<T>({
  onInput,
  options,
  initial,
  isValid = true,
  className
}: InputProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [choice, setChoice] = useState(
    initial !== undefined ? options[initial].display : "Select..."
  );

  useEffect(() => {
    if (isOpen) {
      const close = () => setIsOpen(false);
      document.addEventListener("click", close);
      return () => document.removeEventListener("click", close);
    }
  });

  useEffect(() => {
    if (initial) {
      onInput(options[initial].value);
    }
  }, []);

  return (
    <Select
      onClick={() => setIsOpen(true)}
      isValid={isValid}
      className={className}
    >
      <ChoiceContainer>
        <P>{choice}</P>
        <img src={selectArrow} />
      </ChoiceContainer>
      <If predicate={isOpen}>
        {() => (
          <OptionsContainer>
            {options.map(option => (
              <Option
                key={option.display}
                onClick={() => {
                  setChoice(option.display);
                  onInput(option.value);
                }}
              >
                {option.display}
              </Option>
            ))}
          </OptionsContainer>
        )}
      </If>
    </Select>
  );
}
