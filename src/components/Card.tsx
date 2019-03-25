import React, { ReactNode, useState } from "react";
import styled from "styled-components";
import contextDots from "../assets/context-dots.svg";
import { H2 } from "./base";
import { colors, unit, shadow } from "../styles";
import { CardContextMenu, MenuItemInfo } from "./CardContextMenu";
import { If } from "./If";

const Container = styled.div`
  box-shadow: ${shadow.drop};
  margin-bottom: ${unit(2)};
`;

const Header = styled.div`
  background: ${colors.mint};
  display: flex;
  padding: ${unit(0.5)} ${unit(2)};
  display: flex;
  justify-content: space-between;
`;

const Body = styled.div`
  padding-left: ${unit(2)};
  padding-right: ${unit(2)};
  padding-top: ${unit(2)};
  padding-bottom: ${unit(2)};
  background-color: ${colors.white};
`;

const ActionButton = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  cursor: pointer;
`;

const ContextMenuContainer = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
`;

interface MenuOption {
  display: string;
  action: () => void;
}

interface CardProps {
  title: string;
  children: ReactNode;
  contextMenuOptions?: MenuItemInfo[];
}

export function Card({ title, children, contextMenuOptions }: CardProps) {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const toggleShowContextMenu = () => setShowContextMenu(!showContextMenu);

  return (
    <Container>
      <Header>
        <H2>{title}</H2>
        <If predicate={contextMenuOptions !== undefined}>
          {() => (
            <ActionButton onClick={toggleShowContextMenu}>
              <img src={contextDots} />
              <If predicate={showContextMenu}>
                {() => (
                  <ContextMenuContainer>
                    <CardContextMenu items={contextMenuOptions!} />
                  </ContextMenuContainer>
                )}
              </If>
            </ActionButton>
          )}
        </If>
      </Header>
      <Body>{children}</Body>
    </Container>
  );
}
