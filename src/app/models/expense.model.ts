export interface Expense {
  _id?: string;
  title: string;
  amount: number;
  category: 'Daily' | 'Monthly' | 'Hotel' | 'Restaurant';
  date: string;
}
