import { Liquidity } from "./Components/Liquidity";
import { FormikForm } from "./Components/FormikForm";
import { Swap } from "./Components/Swap";
import { PlainInput } from "./Components/PlainInput";
import { PlainInputAsync } from "./Components/PlainInputAsync";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BankCard } from "./Components/BankCard";
import { CreatePool } from "./Components/CreatePool";
import { Validation } from "./Components/Validation";
import { FieldWithArray } from "./Components/FieldWithArray";

export const App = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <FieldWithArray />
      {/* <Validation /> */}
      {/* <CreatePool /> */}
      {/* <PlainInput /> */}
      {/* <PlainInputAsync /> */}
      {/* <FormikForm /> */}
      {/* <Liquidity /> */}
      {/* <Swap /> */}
      {/* <BankCard /> */}
    </QueryClientProvider>
  );
};
