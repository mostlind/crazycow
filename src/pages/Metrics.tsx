import React from "react";
import { SelectInput } from "../components/SelectInput";
import styled from "styled-components";
import { H2 } from "../components/base";
import { shadow, unit } from "../styles";

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledSelect = styled(SelectInput)`
  box-shadow: ${shadow.drop};
  max-width: ${unit(30)};
`;

export function Metrics() {
  return (
    <div>
      <Header>
        <H2>Metrics</H2>
        <StyledSelect
          options={[
            { display: "This Week", value: 1 },
            { display: "This Month", value: 2 },
            { display: "This Year", value: 3 },
            { display: "Past 30 Days", value: 4 },
            { display: "Past Year", value: 5 }
          ]}
          onInput={val => console.log(val)}
        />
      </Header>
    </div>
  );
}
