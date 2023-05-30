import { ComponentType, ReactNode } from "react";

interface Values {
  email: string;
  password: string;
}

interface MilkProps<T> {
  initialValue?: T;
  onClick?(value: T): void;
  component?: ComponentType<T> | ReactNode;
  children?: ((props: T) => ReactNode) | ReactNode;
}

export const Milk = <T,>({
  initialValue,
  component,
  children,
}: MilkProps<T>) => {
  return null;
};

export const Host = () => {
  return (
    <>
      {/* 猜测这里 T 的推断是以先实例化者为依据 */}
      {/* 例如，在定义 `initialValue` 时，`PreEmail` 的类型定义已经实例化。
          所以，`initialValue` 要受到 `Values` 类型的约束
      */}
      {/* component: ComponentType<T> */}
      <Milk initialValue={{ email: "", password: "" }} component={PreEmail} />

      {/* component: ReactNode */}
      <Milk component={<PreEmail email="" password="" />} />

      {/* 而在这里，`initialValue` 已经实例化。所以，`props` 受到 `{ name: string; }` 约束 */}
      {/* children: ((props: T) => ReactNode) */}
      <Milk initialValue={{ name: "" }}>{(props) => null}</Milk>

      {/* 同样，`onClick` 回调先行实例化。所以，`value` 受到 `{ balabala: string; }` 类型的类型约束 */}
      {/* children: ReactNode; */}
      <Milk
        onClick={(value: { balabala: string }) => value}
        initialValue={{ balabala: "" }}
      >
        <Email />
      </Milk>
    </>
  );
};

const PreEmail = ({ password, email }: Values) => {
  return (
    <>
      <pre>{JSON.stringify(password)}</pre>
      <pre>{JSON.stringify(email)}</pre>
    </>
  );
};

const Email = () => {
  return <pre>"Email Component"</pre>;
};
