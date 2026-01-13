type TransactionType = 'AddMoney' | 'Payout' | 'Refund';

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  amount: number;
  fee: number;
  net: number;
  mode: 'Card' | 'UPI' | 'IMPS' | 'NEFT' | 'NetBanking';
  status: 'Pending' | 'Success' | 'Failed' | 'success' | 'failed';
  reference: string;
  userId?: string;
  phone?: string;
  description?: string;
}
