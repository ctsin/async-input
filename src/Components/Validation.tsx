import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  useField,
  useFormikContext,
} from "formik";
import { ChangeEvent } from "react";
import { object, string } from "yup";

const initialValues = { email: "", emailFoo: "" };

const validationSchema = object({
  email: string().length(4),
});

type Values = typeof initialValues;

const validate = (values: Values) => {
  // 在此处进行关联表单验证
  const errors: Partial<Values> = {};

  if (values.email === "000") {
    errors.emailFoo = "It's 000";
  }

  return errors;
};

export const Validation = () => {
  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={{ email: "", emailFoo: "" }}
      validate={validate}
      onSubmit={(values) => {}}
      initialTouched={{ emailFoo: true }}
      // validateOnBlur={false} // 导致 `setErrors` | `setFieldError` 设置的内容被抹去
      // validateOnChange={false} // 导致 `setErrors` | `setFieldError` 设置的内容被抹去
      // validateOnMount // 不影响 `setErrors` | `setFieldError` 设置
    >
      {({
        values,
        errors,
        touched,
        setValues,
        setErrors,
        setFieldValue,
        setFieldError,
        validateField,
        setFieldTouched,
        validateForm,
      }) => {
        return (
          <Form>
            <h1>Values</h1>
            <pre>{JSON.stringify(values, null, 2)}</pre>
            <h1>Errors</h1>
            <pre>{JSON.stringify(errors, null, 2)}</pre>
            <h1>Touched</h1>
            <pre>{JSON.stringify(touched, null, 2)}</pre>
            <Field
              validate={(value: Values["email"]) => {
                return value === "999" ? "It's 999" : undefined;
              }}
              name="email"
              type="email"
              placeholder="Email"
              value={values.email}
              onChange={({
                target: { value },
              }: ChangeEvent<HTMLInputElement>) => {
                setFieldValue("email", value); // 同等效力
                // setValues({ ...values, email: value }); // 同等效力
                // setFieldTouched("emailFoo");
                // validateField("emailFoo");
                // setFieldError("email", "Foo 100"); // 优先级高于 `validate` 和 `validationSchema`
                // setFieldError("emailFoo", "Foo 100"); // 依然受到 `validateOnBlur` 和 `validateOnChange` 影响
              }}
              // onBlur={() => validateField("emailFoo")}
            />
            <ErrorMessage name="email" className="email" component="div" />
            {/* emailFoo 错误信息的显示并要求对应的表单组件实际存在 */}
            {/* <EmailFoo /> */}
            <ErrorMessage
              name="emailFoo"
              className="email-foo"
              component="div"
            />

            <button onClick={() => setFieldError("emailCheck", "Foo 100")}>
              Validation
            </button>
            <button type="submit">Submit</button>
          </Form>
        );
      }}
    </Formik>
  );
};
export const EmailFoo = () => {
  // 在此处，`values` 和 `value`(of "email") 都能拿到新值
  // 只是，如果验证依赖的是 email value，`<ErrorMessage />` 则要到下次有值更新时才显示。
  const { values, errors } = useFormikContext<Values>();
  const [{ value }] = useField<Values["email"]>("email");

  const validate = (value: string) => {
    // 如果，验证的是 `emailFoo` 的值，则 `<ErrorMessage />` 会如期工作。
    if (value?.length === 3) {
      return "Email length is 3";
    }

    return undefined;
  };

  const [field] = useField({ name: "emailFoo", validate });

  return <input {...field} />;
};
