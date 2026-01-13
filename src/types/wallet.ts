export interface Wallet {
  balance: number;
  credited?: number;
  debited?: number;
  reserved: number;
  currency: string;
}
