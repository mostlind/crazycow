import React, { useState } from "react";
import styled from "styled-components";
import { colors, shadow, unit, fontSizes } from "../styles";
import { P } from "./base";
import { Optional } from "../models/util";

export interface MenuItemInfo {
  confirm?: boolean;
  confirmationMessage: string;
  action: () => void;
  displayText: string;
}

interface ConfirmationInfo {
  confirmationMessage: string;
  action: () => void;
}

const Container = styled.div`
  background-color: ${colors.white};
  box-shadow: ${shadow.drop};
  min-width: ${unit(15)};
  padding: ${unit(1)};
`;

const Button = {
  Primary: styled.button`
    background: ${colors.purple};
    border-style: none;
    color: ${colors.white};
    padding: ${unit(1)} ${unit(3)};
    margin-left: ${unit(1)};
    margin-right: ${unit(1)};
    cursor: pointer;
    font-size: ${fontSizes.small};
    vertical-align: middle;
  `,
  Secondary: styled.button`
    background: none;
    border-style: none;
    color: ${colors.darkGrey};
    padding: ${unit(1)} ${unit(3)};
    text-decoration: underline;
    margin-left: ${unit(1)};
    margin-right: ${unit(1)};
    cursor: pointer;
    font-size: ${fontSizes.small};
    vertical-align: middle;
  `
};

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
`;

const Item = styled.div``;

interface CardContextMenuProps {
  items: MenuItemInfo[];
}

export function CardContextMenu({ items }: CardContextMenuProps) {
  const [confirmation, setConfirmation] = useState(null as Optional<
    ConfirmationInfo
  >);
  return (
    <Container>
      {confirmation ? (
        <div>
          <P style={{ marginBottom: unit(2) }}>
            {confirmation.confirmationMessage}
          </P>
          <ButtonGroup>
            <Button.Secondary
              onClick={() => {
                setConfirmation(null);
              }}
            >
              No
            </Button.Secondary>
            <Button.Primary
              onClick={() => {
                confirmation.action();
                setConfirmation(null);
              }}
            >
              Yes
            </Button.Primary>
          </ButtonGroup>
        </div>
      ) : (
        items.map(
          ({ displayText, action, confirm = false, confirmationMessage }) => {
            return (
              <Item key={displayText}>
                <P
                  onClick={e => {
                    e.stopPropagation();
                    confirm
                      ? setConfirmation({ confirmationMessage, action })
                      : action();
                  }}
                >
                  {displayText}
                </P>
              </Item>
            );
          }
        )
      )}
    </Container>
  );
}
