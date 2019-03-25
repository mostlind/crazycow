import React, { useState } from "react";
import styled from "styled-components";
import { unit, colors, fontSizes } from "../styles";

const validationColor = ({ isValid }: { isValid: boolean }) =>
  isValid ? colors.purple : colors.red;

const Input = styled.input`
  border: none;
  padding: ${unit(1)};
  padding-bottom: ${unit(0.5)};
  border-bottom: solid ${unit(0.5)} ${validationColor};
  width: 100%;
  font-size: ${fontSizes.small};
  transition: background-color 100ms ease-out;
  border-radius: 0;
  &:hover {
    background-color: ${colors.grey};
  }
`;

interface InputProps {
  onInput: (value: string) => void;
  isValid?: boolean;
  placeholder: string;
}

export function TextInput({
  onInput,
  isValid = true,
  placeholder
}: InputProps) {
  return (
    <Input
      isValid={isValid}
      placeholder={placeholder}
      onInput={e => {
        const value = e.currentTarget.value;

        onInput(value);
      }}
    />
  );
}
