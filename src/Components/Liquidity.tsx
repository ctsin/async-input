import { isString, isUndefined, random, round } from "lodash";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { NumberFormatValues } from "react-number-format";
import {
  CardContainer,
  Column,
  Label,
  Container,
  NumericFormatStyled,
  Error,
  H1,
  Row,
} from "./Styled";
import { sleep } from "./utilities";
import { Warrant, Warrants } from "../interface/Warrant";

export interface Input extends Pick<Warrant, "warrantID" | "evaluatedPrice"> {
  active: boolean;
  error: string | null;
  validateAmount: ReturnType<typeof validateAmount>;
}
export type Inputs = Input[];

export const DUMMY_DATA: Warrants = [
  {
    warrantID: nanoid(),
    warrantName: "Plan A",
    amountAvailable: 3212.0098,
    evaluatedPrice: 756.0,
  },
  {
    warrantID: nanoid(),
    warrantName: "Plan B",
    amountAvailable: 2632.08,
    evaluatedPrice: 2632.08,
  },
  {
    warrantID: nanoid(),
    warrantName: "Plan C",
    amountAvailable: 62.78,
    evaluatedPrice: 62.78,
  },
];

export type EvaluateParam = Pick<Warrant, "warrantID" | "evaluatedPrice">;
export const evaluate = async ({
  warrantID,
  evaluatedPrice,
}: EvaluateParam): Promise<Warrants> => {
  await sleep(2000);

  return DUMMY_DATA.map((data) => {
    if (data.warrantID === warrantID) {
      return { ...data, evaluatedPrice };
    }

    return {
      ...data,
      evaluatedPrice: round((data?.evaluatedPrice ?? 0) * random(0.8, 1.2)),
    };
  });
};

export const validateAmount =
  (amountAvailable: Warrant["amountAvailable"]) =>
  (evaluatedPrice: Warrant["evaluatedPrice"]): Input["error"] => {
    if (isUndefined(evaluatedPrice)) return null;

    return evaluatedPrice > amountAvailable ? "Exceeds asset balance" : null;
  };

export const Liquidity = () => {
  const [inputs, setInputs] = useState<Inputs>(() =>
    DUMMY_DATA.map(({ warrantID, amountAvailable }) => ({
      evaluatedPrice: undefined,
      warrantID,
      active: false,
      error: null,
      validateAmount: validateAmount(amountAvailable),
    }))
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const invalid = inputs.some(({ error }) => isString(error));

    if (invalid) return;

    const timer = setTimeout(() => {
      const active = inputs.find(({ active }) => active);
      if (isUndefined(active)) return;

      setLoading(true);

      evaluate(active)
        .then((response) => {
          setInputs(() => {
            return response.map((warrant, index) => {
              const input = inputs[index];
              const { validateAmount } = input;
              const { evaluatedPrice } = warrant;

              if (isUndefined(evaluatedPrice))
                return { ...input, ...warrant, active: false };

              const error = validateAmount(evaluatedPrice);

              return { ...input, ...warrant, error, active: false };
            });
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }, 1000);
    return () => clearTimeout(timer);
  }, [inputs]);

  const onValueChange =
    ({ warrantID }: Pick<Warrant, "warrantID">) =>
    ({ floatValue }: NumberFormatValues) => {
      setInputs((prev) =>
        prev.map((input) => {
          if (isUndefined(floatValue)) return input;
          const { validateAmount } = input;

          const error = validateAmount(floatValue);

          if (input.warrantID === warrantID) {
            return {
              ...input,
              evaluatedPrice: floatValue,
              active: true,
              error,
            };
          }

          return { ...input, active: false };
        })
      );
    };

  return (
    <CardContainer>
      <H1>Invest</H1>

      {DUMMY_DATA.map(({ warrantName, warrantID, amountAvailable }, index) => {
        return (
          <Column key={warrantID} style={{ marginBottom: "2em" }}>
            <Row
              style={{
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Label htmlFor={warrantID}>
                {warrantName}
                <span>Available Amount: $ {amountAvailable}</span>
              </Label>
              <Container isLoading={inputs[index].active && loading}>
                <NumericFormatStyled
                  id={warrantID}
                  value={inputs[index].evaluatedPrice}
                  thousandSeparator=","
                  onValueChange={onValueChange({ warrantID })}
                  placeholder="$ 0.00"
                  prefix="$ "
                  disabled={loading}
                />
                {inputs[index].error && <Error>{inputs[index].error}</Error>}
              </Container>
            </Row>
          </Column>
        );
      })}
    </CardContainer>
  );
};
