import { useForm } from "antd/es/form/Form";
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
    // initialTouched 的设置方式
    initialTouched={{ products: [{ name: true, price: true, inStock: true }] }}
    onSubmit={(values) => {
      alert(JSON.stringify(values, null, 2));
    }}
  >
    <MainForm />
  </Formik>
);

const MainForm = () => {
  const { values, touched, setFieldValue } = useFormikContext<Values>();
  const [{ value: products }, , { setValue }] =
    useField<Values["products"]>("products");
  return (
    <Form>
      <pre>{JSON.stringify(values, null, 2)}</pre>
      <pre>{JSON.stringify(touched, null, 2)}</pre>
      {/* FieldArray[name] 作为 FieldArray.helper 操作的基准 */}
      <FieldArray name="products">
        {({ push, remove }) => {
          return (
            <div>
              {values.products.map((product, index) => {
                return (
                  <div key={index}>
                    <label htmlFor="name">Name</label>
                    <Field
                      onChange={({
                        target: { value },
                      }: ChangeEvent<HTMLInputElement>) => {
                        console.log(
                          "🚀 ~ file: FieldWithArray.tsx:50 ~ {values.products.map ~ value:",
                          value
                        );
                        // 可以工作
                        // setValue([{ name: "1", price: "2", inStock: "3" }]);

                        // 可以工作，但会导致丢失控件焦点
                        setFieldValue(`products.${index}`, {
                          name: `${value}1`,
                          price: `${value}2`,
                          inStock: `${value}3`,
                        });

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
                    <Price index={index} />
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

const Price = ({ index }: { index: number }) => {
  const { setFieldValue } = useFormikContext<Values>();
  const price = `products.${index}.price`;
  const inStock = `products.${index}.inStock`;
  const indexedProduct = `products.${index}`;
  // 尝试范型 Values["products"][number]["name"]
  const [, , { setValue: setPrice }] =
    useField<Values["products"][number]["name"]>(price);
  const [, , { setValue: setInStock }] =
    useField<Values["products"][number]["inStock"]>(inStock);

  const [, { value: indexedProductValue }, { setValue: setIndexedProduct }] =
    useField<Values["products"][number]>(indexedProduct);

  return (
    <Field
      name={price}
      onChange={({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
        // 最后的理论：还是要每个键单独更新值。
        setPrice(value);
        // setInStock(value.toUpperCase());

        // 可以工作，但是 price 却没有正确地输入，且不能连续输入。
        // setIndexedProduct({
        //   ...indexedProductValue,
        //   name: value,
        //   inStock: value,
        // });
      }}
    />
  );
};
