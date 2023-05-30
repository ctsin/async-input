import {
  NumberFormatValues,
  NumericFormat,
  NumericFormatProps,
} from "react-number-format";
import { H1 } from "./Styled";
import {
  FieldArray,
  FieldConfig,
  Form,
  Formik,
  FormikConfig,
  getIn,
  useField,
  useFormikContext,
} from "formik";
import { nanoid } from "nanoid";
import { array, object, string } from "yup";
import { ChangeEvent, useCallback } from "react";
import { isNil, isUndefined, random } from "lodash";

import styles from "./index.module.css";

type WarrantField = Partial<{
  warrantId: string;
  warrantName: string;
  logoUrl: string;
  weight: number;
  amount: number;
  balance: number;
}>;

interface Values {
  warrants: WarrantField[];
}

const OPTIONS = Array.from({ length: 10 }, (_, i) => {
  const id = nanoid();
  return {
    warrantId: id,
    value: id,
    balance: random(10_0000, 10_000_000),
  };
});

export const ERROR_MESSAGES = {
  ExceedsAssetBalance: "Exceeds asset balance",
  IncorrectAssetWeights: "Incorrect asset weights",
};

const validationSchema = array(object({ warrantId: string().required() }));

export const CreatePool = () => {
  const initialValues: Values = {
    warrants: [
      {
        warrantId: undefined,
        weight: undefined,
        amount: undefined,
        balance: undefined,
      },
      {
        warrantId: undefined,
        weight: undefined,
        amount: undefined,
        balance: undefined,
      },
    ],
  };
  const onSubmit: FormikConfig<Values>["onSubmit"] = (values) => {
    console.table(values);
  };

  return (
    <div>
      <H1>Create Pool</H1>

      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ values }) => (
          <Form>
            <FieldArray name="warrants">
              {(arrayHelpers) => (
                <>
                  {values.warrants.map(
                    ({ warrantId, weight, amount, balance }, index) => {
                      return (
                        <div key={index} className={styles.row}>
                          <div className={styles.controls}>
                            <AssetsDropdown
                              name={`warrants.${index}.warrantId`}
                              balanceName={`warrants.${index}.balance`}
                            />
                            <WeightInput name={`warrants.${index}.weight`} />
                            <AmountInput name={`warrants.${index}.amount`} />
                            <button
                              className={styles.remove}
                              type="button"
                              onClick={() => arrayHelpers.remove(index)}
                            >
                              REMOVE
                            </button>
                          </div>

                          <Balance name={`warrants.${index}.balance`} />
                          <BalanceValidationResult
                            name={`warrants.${index}.amount`}
                            balanceName={`warrants.${index}.balance`}
                          />
                        </div>
                      );
                    }
                  )}

                  <div className={styles.actions}>
                    <button type="button" onClick={() => arrayHelpers.push({})}>
                      Add More Assets
                    </button>
                    Weighted Pool supports up to 8 assets in the pool!
                  </div>
                </>
              )}
            </FieldArray>

            <button type="submit">Submit</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

type UseField = Values["warrants"][number];

interface NumericProps
  extends Omit<NumericFormatProps, "value" | "defaultValue" | "customInput"> {
  name: FieldConfig["name"];
}
const WeightInput = (props: NumericProps) => {
  const [field, , { setValue }] = useField<UseField["weight"]>(props);

  const onValueChange = ({ floatValue }: NumberFormatValues) => {
    setValue(floatValue);
  };

  return (
    <div className={styles.weight}>
      <NumericFormat
        {...props}
        {...field}
        placeholder="Weight 0.0%"
        onValueChange={onValueChange}
        suffix="%"
      />
    </div>
  );
};

const AmountInput = (props: NumericProps) => {
  const [field, , { setValue }] = useField<UseField["amount"]>({ ...props });

  const onValueChange = ({ floatValue }: NumberFormatValues) => {
    setValue(floatValue);
  };

  return (
    <div className={styles.amount}>
      <NumericFormat
        {...props}
        {...field}
        placeholder="0.0"
        onValueChange={onValueChange}
      />
      <span className={styles.suffix}>Ton</span>
    </div>
  );
};

const Balance = (props: NumericProps) => {
  const [field] = useField<UseField["balance"]>(props);
  const { value } = field;

  if (isNil(value)) return null;

  return (
    <div className={styles.balance}>
      My balance:{" "}
      <NumericFormat
        {...props}
        {...field}
        thousandSeparator=","
        displayType="text"
      />
      {" Ton"}
    </div>
  );
};

interface AssetsDropdownProps extends FieldConfig<Values> {
  balanceName: string;
}
const AssetsDropdown = ({ name, balanceName }: AssetsDropdownProps) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(name);

  const onChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const { value } = event.target;
      setFieldValue(name, value);

      const asset = OPTIONS.find(({ value: v }) => v === value);

      setFieldValue(
        balanceName,
        isUndefined(asset) ? undefined : asset.balance
      );
    },
    [name, balanceName, setFieldValue]
  );

  return (
    <select {...field} onChange={onChange} className={styles.select}>
      <option value="">Select Assets</option>
      {OPTIONS.map(({ value, warrantId }) => (
        <option key={warrantId} value={value}>
          {warrantId}
        </option>
      ))}
    </select>
  );
};

interface BalanceValidationResultProps extends FieldConfig<Values> {
  balanceName: string;
}
const BalanceValidationResult = ({
  name,
  balanceName,
}: BalanceValidationResultProps) => {
  const { values } = useFormikContext<Values>();

  const value = getIn(values, name);
  if (isUndefined(value)) return null;
  const balance = getIn(values, balanceName);
  return +value > balance ? (
    <div className={styles.validation}>
      {ERROR_MESSAGES.ExceedsAssetBalance}
    </div>
  ) : null;
};
