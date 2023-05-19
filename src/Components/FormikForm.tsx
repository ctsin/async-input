import { NumberFormatValues, NumericFormatProps } from "react-number-format";
import { CardContainer, Contained, NumericPlain, H1, Error } from "./Styled";
import { ErrorMessage, FieldConfig, Form, Formik, useField } from "formik";
import * as yup from "yup";

interface FooInputProps
  extends Omit<NumericFormatProps, "value" | "defaultValue" | "customInput"> {
  name: FieldConfig["name"];
}

const Numeric = (props: FooInputProps) => {
  const { name } = props;
  const [field, , { setValue }] = useField(props);
  const { value } = field;

  const onFooValueChange = ({ floatValue }: NumberFormatValues) => {
    setValue(floatValue);
  };

  return (
    <Contained>
      <NumericPlain {...field} value={value} onValueChange={onFooValueChange} />
      <ErrorMessage
        name={name}
        render={(msg) => (
          <Error style={{ justifyContent: "flex-start" }}>{msg}</Error>
        )}
      />
    </Contained>
  );
};

export const FormikForm = () => {
  const schema = yup.object().shape({ foo: yup.number().required().max(10) });

  const onSubmit = () => {
    console.log("SUBMITTED");
  };

  return (
    <Formik
      initialValues={{ foo: undefined }}
      onSubmit={onSubmit}
      validationSchema={schema}
    >
      <CardContainer>
        <H1>Formik</H1>
        <Form>
          <Numeric name="foo" />
        </Form>
      </CardContainer>
    </Formik>
  );
};
