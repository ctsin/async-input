import { useState } from "react";
import { NumberFormatValues, NumericFormat } from "react-number-format";
import { CardContainer, H1, NumericPlain } from "./Styled";
import {
  Field,
  FieldArray,
  FieldProps,
  Form,
  Formik,
  FormikConfig,
} from "formik";
import { nanoid } from "nanoid";

interface WarrantField {
  warrantId: string;
  weight: number | undefined;
  amount: number | undefined;
  balance: number | undefined;
}

interface Values {
  warrants: WarrantField[];
}

export const CreatePool = () => {
  const initialValues: Values = {
    warrants: [
      {
        warrantId: nanoid(),
        weight: undefined,
        amount: undefined,
        balance: undefined,
      },
      {
        warrantId: nanoid(),
        weight: undefined,
        amount: undefined,
        balance: undefined,
      },
    ],
  };
  const onSubmit: FormikConfig<Values>["onSubmit"] = (values) => {
    console.log("🚀 ~ file: CreatePool.tsx:59 ~ CreatePool ~ values:", values);
  };

  return (
    <CardContainer>
      <H1>Create Pool</H1>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ values }) => (
          <Form>
            <FieldArray name="warrants">
              {(arrayHelpers) => {
                return (
                  <>
                    {values.warrants.map(
                      ({ warrantId, weight, amount, balance }, index) => {
                        return (
                          <div key={warrantId}>
                            <div>{warrantId}</div>
                            <Field
                              name={`warrants.${index}.weight`}
                              as={NumericFormat}
                            />
                            <Field name={`warrants.${index}.amount`}>
                              {({
                                field,
                              }: FieldProps<
                                Values["warrants"][number]["amount"]
                              >) => {
                                return <NumericFormat {...field} />;
                              }}
                            </Field>
                          </div>
                        );
                      }
                    )}
                  </>
                );
              }}
            </FieldArray>
            <button type="submit">Submit</button>
          </Form>
        )}
      </Formik>
    </CardContainer>
  );
};
