import { isEmpty, isNull, isUndefined, random } from "lodash";
import { nanoid } from "nanoid";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
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

const ERROR = {
  EXCEED: "Exceeds asset balance",
};

export const DUMMY_DATA: Warrants = [
  {
    warrantID: nanoid(),
    warrantName: "Project A",
    amountAvailable: 212.08,
    evaluatedPrice: 756.0,
  },
  {
    warrantID: nanoid(),
    warrantName: "Project B",
    amountAvailable: 2632.08,
    evaluatedPrice: 2632.08,
  },
  {
    warrantID: nanoid(),
    warrantName: "Project C",
    amountAvailable: 6322.66,
    evaluatedPrice: 22.8,
  },
  {
    warrantID: nanoid(),
    warrantName: "Project D",
    amountAvailable: 5432.3,
    evaluatedPrice: 32.08,
  },
  {
    warrantID: nanoid(),
    warrantName: "Project E",
    amountAvailable: 7662.08,
    evaluatedPrice: 28.3,
  },
  {
    warrantID: nanoid(),
    warrantName: "Project F",
    amountAvailable: 4232.672,
    evaluatedPrice: 90.26,
  },
];

export type EvaluateParam = Pick<Warrant, "warrantID" | "evaluatedPrice">;
const evaluate = async ({
  warrantID,
  evaluatedPrice,
}: EvaluateParam): Promise<Warrants> => {
  await sleep(random(400, 1200));

  return DUMMY_DATA.map((data) => {
    if (data.warrantID === warrantID) {
      return { ...data, evaluatedPrice };
    }

    return {
      ...data,
      evaluatedPrice: (data?.evaluatedPrice ?? 0) * random(0.8, 1.2),
    };
  });
};

export const Swap = () => {
  const sourceOptions = useMemo(
    () =>
      DUMMY_DATA.map(({ warrantID, warrantName }) => ({
        warrantID,
        warrantName,
      })),
    []
  );

  const targetOptions = useMemo(
    () =>
      DUMMY_DATA.map(({ warrantID, warrantName }) => ({
        warrantID,
        warrantName,
      })),
    []
  );

  const [sourceWarrant, setSourceWarrant] = useState<Warrant | null>(null);
  const [sourceValue, setSourceValue] = useState<number | undefined>(undefined);
  const [sourceMarket, setSourceMarket] = useState<number | null>(null);
  const [sourceLoading, setSourceLoading] = useState(false);

  const onSourceOptionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;

    if (isEmpty(value)) {
      setSourceWarrant(null);
      setSourceValue(undefined);
      setSourceMarket(null);
      return;
    }

    const selected = DUMMY_DATA.find((option) => option.warrantID === value);

    if (isUndefined(selected)) return;

    setSourceWarrant(selected);
  };

  const onSourceValueChange = ({ floatValue }: NumberFormatValues) => {
    if (isNull(sourceWarrant)) return;

    setSourceValue(floatValue);
  };

  const sourceValueError = useMemo(() => {
    if (isNull(sourceWarrant)) return null;

    if (isNull(sourceValue)) return null;

    if (isUndefined(sourceValue)) return null;

    if (sourceValue > sourceWarrant.amountAvailable) {
      return ERROR.EXCEED;
    }

    return null;
  }, [sourceValue, sourceWarrant]);

  useEffect(() => {
    if (isNull(sourceWarrant)) return;

    if (isNull(sourceValue)) return;

    if (isUndefined(sourceValue)) return;

    if (!isNull(sourceValueError)) return;

    const timer = setTimeout(() => {
      setSourceLoading(true);

      evaluate({
        warrantID: sourceWarrant.warrantID,
        evaluatedPrice: sourceValue,
      })
        .then((_) => {
          setSourceMarket(random(8, 2000));
        })
        .finally(() => {
          setSourceLoading(false);
        });
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [sourceValue, sourceValueError, sourceWarrant]);

  const [targetWarrant, setTargetWarrant] = useState<Warrant | null>(null);
  const [targetValue, setTargetValue] = useState<number | undefined>(undefined);
  const [targetMarket, setTargetMarket] = useState<number | null>(null);
  const [targetLoading, setTargetLoading] = useState(false);

  const onTargetOptionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;

    if (isEmpty(value)) {
      setTargetWarrant(null);
      setTargetValue(undefined);
      setTargetMarket(null);
      return;
    }
    const selected = DUMMY_DATA.find((option) => option.warrantID === value);

    if (isUndefined(selected)) return;

    setTargetWarrant(selected);
  };

  const onTargetValueChange = ({ floatValue }: NumberFormatValues) => {
    if (isNull(targetWarrant)) return;

    setTargetValue(floatValue);
  };

  const targetValueError = useMemo(() => {
    if (isNull(targetWarrant)) return null;

    if (isNull(targetValue)) return null;

    if (isUndefined(targetValue)) return null;

    if (targetValue > targetWarrant.amountAvailable) {
      return ERROR.EXCEED;
    }

    return null;
  }, [targetValue, targetWarrant]);

  useEffect(() => {
    if (isNull(targetWarrant)) return;

    if (isNull(targetValue)) return;

    if (isUndefined(targetValue)) return;

    if (!isNull(targetValueError)) return;

    const timer = setTimeout(() => {
      setTargetLoading(true);

      evaluate({
        warrantID: targetWarrant.warrantID,
        evaluatedPrice: targetValue,
      })
        .then((_) => {
          setTargetMarket(random(8, 2000));
        })
        .finally(() => {
          setTargetLoading(false);
        });
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [targetValue, targetValueError, targetWarrant]);

  return (
    <CardContainer>
      <H1>Swap</H1>

      <Column style={{ marginBottom: "2em" }}>
        <Row
          style={{
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Label as="div">
            <select id="source-options" onChange={onSourceOptionChange}>
              <option value="">-</option>
              {sourceOptions.map(({ warrantID, warrantName }) => (
                <option key={warrantID} value={warrantID}>
                  {warrantName}
                </option>
              ))}
            </select>
            <span>
              Available Amount:
              {isNull(sourceWarrant)
                ? "-"
                : `$ ${sourceWarrant.amountAvailable}`}
            </span>
            <span>
              Market Value:
              {isNull(sourceMarket) ? "-" : `$ ${sourceMarket}`}
            </span>
          </Label>
          <Container isLoading={sourceLoading}>
            <NumericFormatStyled
              id="source-input"
              value={sourceValue}
              isAllowed={() => !isNull(sourceWarrant)}
              thousandSeparator=","
              onValueChange={onSourceValueChange}
              placeholder="$ 0.00"
              prefix="$ "
              disabled={sourceLoading}
            />
            {sourceValueError && <Error>{sourceValueError}</Error>}
          </Container>
        </Row>
      </Column>

      <Column style={{ marginBottom: "2em" }}>
        <Row
          style={{
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Label as="div">
            <select id="target-options" onChange={onTargetOptionChange}>
              <option value="">-</option>
              {targetOptions.map(({ warrantID, warrantName }) => (
                <option key={warrantID} value={warrantID}>
                  {warrantName}
                </option>
              ))}
            </select>
            <span>
              Available Amount:
              {isNull(targetWarrant)
                ? "-"
                : `$ ${targetWarrant.amountAvailable}`}
            </span>
            <span>
              <div>
                Market Value:
                {isNull(targetMarket) ? "-" : `$ ${targetMarket}`}
              </div>
            </span>
          </Label>
          <Container isLoading={targetLoading}>
            <NumericFormatStyled
              id="target-input"
              value={targetValue}
              isAllowed={() => !isNull(targetWarrant)}
              thousandSeparator=","
              onValueChange={onTargetValueChange}
              placeholder="$ 0.00"
              prefix="$ "
              disabled={targetLoading}
            />
            {targetValueError && <Error>{targetValueError}</Error>}
          </Container>
        </Row>
      </Column>
    </CardContainer>
  );
};
