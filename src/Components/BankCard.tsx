import { useState } from "react";
import { NumberFormatValues } from "react-number-format";
import { CardContainer, H1, CardInput } from "./Styled";

export const BankCard = () => {
  const [value, setValue] = useState<number | undefined>(undefined);

  const onValueChange = (values: NumberFormatValues) => {
    const { floatValue } = values;

    setValue(floatValue);
  };

  return (
    <CardContainer>
      <H1>Band Card</H1>
      <CardInput
        format="#### #### #### ####"
        value={value}
        onValueChange={onValueChange}
      />
    </CardContainer>
  );
};
