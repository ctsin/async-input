import { useMemo, useState } from "react";
import { NumberFormatValues } from "react-number-format";
import { CardContainer, Contained, H1, NumericPlain } from "./Styled";
import { isNil, isUndefined } from "lodash";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const PlainInputAsync = () => {
  const client = useQueryClient();
  const [value, setValue] = useState<number | undefined>(undefined);

  const onValueChange = ({ floatValue }: NumberFormatValues) => {
    setValue((prev) => {
      console.log("🚀 ~ file: PlainInputAsync.tsx:22 ~ setValue ~ prev:", prev);
      console.log(
        "🚀 ~ file: PlainInputAsync.tsx:27 ~ setValue ~ floatValue:",
        floatValue
      );
      client.cancelQueries({ queryKey: [prev] });

      return floatValue;
    });
  };

  const { data, isInitialLoading } = useQuery({
    queryKey: [value],
    async queryFn({ signal }) {
      const posts = await fetch("https://jsonplaceholder.typicode.com/posts", {
        signal,
      }).then((res) => res.json());
      console.log(
        "🚀 ~ file: PlainInputAsync.tsx:31 ~ queryFn: ~ posts:",
        posts
      );

      return value;
    },
    enabled: !isUndefined(value),
  });

  const valueMessage = useMemo(() => {
    if (isNil(data)) return `is ${String(data)}`;

    const isEven = data % 2 === 0;

    return isEven ? "is even" : "isn't even";
  }, [data]);

  return (
    <CardContainer>
      <H1>Async Plain Input</H1>
      <Contained isLoading={isInitialLoading}>
        <NumericPlain value={value} onValueChange={onValueChange} />
      </Contained>

      <div>The value {valueMessage}</div>
    </CardContainer>
  );
};
