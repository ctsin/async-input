export interface Warrant {
  warrantID: string;
  warrantName: string;
  amountAvailable: number;
  evaluatedPrice: number | undefined;
}

export type Warrants = Warrant[];
