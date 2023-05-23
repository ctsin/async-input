import { useState } from "react";
import { NumberFormatValues } from "react-number-format";
import { CardContainer, H1, NumericPlain } from "./Styled";

export const PlainInput = () => {
  const [value, setValue] = useState<number | undefined>(undefined);

  const onValueChange = (values: NumberFormatValues) => {
    console.log(
      "🚀 ~ file: PlainInput.tsx:9 ~ onValueChange ~ values:",
      values
    );
    const { floatValue } = values;

    setValue(floatValue);
  };

  return (
    <CardContainer>
      <H1>Plain Input</H1>
      <NumericPlain
        value={value}
        onValueChange={onValueChange}
        thousandSeparator=","
      />
    </CardContainer>
  );
};
