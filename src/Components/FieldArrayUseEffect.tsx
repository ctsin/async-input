import {
  Formik,
  Field,
  Form,
  useFormikContext,
  FieldArray,
  useField,
} from "formik";
import { isString, isUndefined } from "lodash";
import { useEffect } from "react";
import { NumberFormatValues, NumericFormat } from "react-number-format";

interface AssetRaw {
  name: string;
  weight: number;
  amount: number;
}
type Asset = Partial<AssetRaw>;
type Assets = Asset[];

interface ComputedPropsRaw {
  balance: number;
  balanceFormatted: string;
  weightFormatted: string;
  amountFormatted: string;
  amountError: string;
}
type ComputedProps = Partial<ComputedPropsRaw>;
type Computed = ComputedProps[];

interface Values {
  assets: Assets;
  computed: Computed;
}

const asset: Asset = { name: undefined, weight: undefined, amount: undefined };
const computedProps: ComputedProps = {
  balance: undefined,
  balanceFormatted: undefined,
  weightFormatted: undefined,
  amountFormatted: undefined,
  amountError: undefined,
};

const initialValues: Values = {
  assets: [asset],
  computed: [computedProps],
};

type AssetName = keyof Asset;
const assetKeyOf = (index: number) => (name: AssetName) =>
  `assets.${index}.${name}`;

type ComputedName = keyof ComputedProps;
const computedKeyOf =
  (index: number) => (name: Exclude<ComputedName, AssetName>) =>
    `computed.${index}.${name}`;

export const FieldArrayUseEffect = () => (
  <Formik
    initialValues={initialValues}
    // 必须要具体的 Field，这里 computed: [] 不能为 boolean
    // initialTouched={{ computed: true }}
    onSubmit={(values) => {
      alert(JSON.stringify(values, null, 2));
    }}
  >
    <MainForm />
  </Formik>
);

const MainForm = () => {
  const { values, errors, touched } = useFormikContext<Values>();
  return (
    <Form>
      <FieldArray name="assets">
        {({ push, remove }) => {
          return (
            <div className="row">
              {values.assets.map((asset, index) => {
                return (
                  <div key={index}>
                    <label htmlFor={`assets.${index}.name`}>Name</label>
                    <Field name={`assets.${index}.name`} />
                    <label htmlFor={`assets.${index}.weight`}>Weight</label>
                    <Weight index={index} />
                    <label htmlFor={`assets.${index}.amount`}>Amount</label>
                    <Field name={`assets.${index}.amount`} type="number" />
                    <button type="button" onClick={() => remove(index)}>
                      Remove
                    </button>
                    <Balance index={index} />
                  </div>
                );
              })}
              <button type="button" onClick={() => push({})}>
                Add
              </button>
              <button type="submit">Submit</button>
            </div>
          );
        }}
      </FieldArray>
      <hr />
      <pre>Values</pre>
      <pre>{JSON.stringify(values, null, 2)}</pre>
      <hr />
      <pre>Error</pre>
      <pre>{JSON.stringify(errors, null, 2)}</pre>
      <hr />
      <pre>Touched</pre>
      <pre>{JSON.stringify(touched, null, 2)}</pre>
    </Form>
  );
};

const Weight = ({ index }: { index: number }) => {
  const getAssetOf = assetKeyOf(index);
  const getComputedOf = computedKeyOf(index);
  const weightName = getAssetOf("weight");
  const weightFormattedName = getComputedOf("weightFormatted");
  // 尝试范型 Values["assets"][number]["name"]
  // T 必须接受 extends AssetName 约束
  // type ValueOf<T extends AssetName> = Values["assets"][number][T];
  const [
    { onChange: _, ...restField },
    { value: weight },
    { setValue: setWeight },
  ] = useField<Asset["weight"]>(weightName);

  const [, , { setValue: setWeightFormatted }] =
    useField<ComputedProps["amountFormatted"]>(weightFormattedName);

  const [{ value: computed }, , { setValue: setComputed }] =
    useField<ComputedProps>(`computed.${index}`);

  useEffect(() => {
    if (isUndefined(weight)) return;

    // setWeightFormatted(weight.toFixed(2));

    // setComputed({
    //   ...computed,
    //   weightFormatted: weight.toFixed(2),
    //   balance: Number((weight * Math.random() * 10).toFixed(2)),
    // });
    // 批量更新需要移除 `computed`, `weightFormatted` 依赖
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weight]);

  const onValueChange = ({
    floatValue,
    formattedValue,
  }: NumberFormatValues) => {
    setWeight(floatValue);

    // 在 `onValueChange` 里对索引位置批量更新，似乎也没有性能问题。
    setComputed({
      ...computed,
      balanceFormatted: formattedValue,
      balance: floatValue,
    });
  };

  return (
    <NumericFormat
      {...restField}
      onValueChange={onValueChange}
      thousandSeparator=","
      prefix="$"
    />
  );
};

interface BalanceProps {
  index: number;
}
const Balance = ({ index }: BalanceProps) => {
  const getComputedOf = computedKeyOf(index);
  const balanceName = getComputedOf("balance");
  const balanceFormattedName = getComputedOf("balanceFormatted");
  const validate = (value: ComputedProps["balance"]) => {
    if (isUndefined(value)) return;

    if (value > 100) return "balance exceeded";
  };
  const [, { value: balance, error }] = useField<ComputedProps["balance"]>({
    name: balanceName,
    validate,
  });
  const [, { value: balanceFormatted, error: balanceError }] = useField<
    ComputedProps["balanceFormatted"]
  >({
    name: balanceFormattedName,
  });

  return (
    <>
      <pre>
        balance: {balance} {isString(error) ? <b>{error}</b> : null}
      </pre>
      <pre>
        balanceFormatted: {balanceFormatted}{" "}
        {isString(balanceError) ? balanceError : null}
      </pre>
    </>
  );
};
