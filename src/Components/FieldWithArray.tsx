import {
  Formik,
  Field,
  Form,
  ErrorMessage,
  useFormikContext,
  FieldArray,
  useField,
  setIn,
} from "formik";
import { ChangeEvent } from "react";

const initialValues = {
  products: [{ name: "", price: "", inStock: "" }],
};

type Values = typeof initialValues;

export const FieldWithArray = () => (
  <Formik
    initialValues={initialValues}
    onSubmit={(values) => {
      alert(JSON.stringify(values, null, 2));
    }}
  >
    <MainForm />
  </Formik>
);

const MainForm = () => {
  const { values } = useFormikContext<Values>();
  const [{ value: products }, , { setValue }] =
    useField<Values["products"]>("products");
  console.log(
    "🚀 ~ file: FieldWithArray.tsx:68 ~ MainForm ~ products:",
    products
  );

  return (
    <Form>
      <pre>{JSON.stringify(values, null, 2)}</pre>
      <FieldArray name="products">
        {({ push, remove }) => {
          return (
            <div>
              {values.products.map((product, index) => {
                return (
                  <div key={product.name}>
                    <label htmlFor="name">Name</label>
                    <Field
                      onChange={() => {
                        setValue([{ name: "1", price: "2", inStock: "3" }]);

                        // setIn 不太行
                        // setIn(values, ["products", index].join("."), {
                        //   name: "1",
                        //   price: "2",
                        //   inStock: "3",
                        // });
                      }}
                      name={`products.${index}.name`}
                    />
                    <label htmlFor="price">Price</label>
                    <Field name={`products.${index}.price`} />
                    <label htmlFor="inStock">In Stock</label>
                    <Field name={`products.${index}.inStock`} />
                    <button type="button" onClick={() => remove(index)}>
                      Remove
                    </button>
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
    </Form>
  );
};
