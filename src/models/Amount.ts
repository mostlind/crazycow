export interface Amount {
  id: number;
  percent: string;
}

export const amounts: Amount[] = [
  {
    id: 1,
    percent: "0%"
  },
  {
    id: 2,
    percent: "25%"
  },
  {
    id: 3,
    percent: "50%"
  },
  {
    id: 4,
    percent: "75%"
  },
  {
    id: 5,
    percent: "100%"
  }
];
