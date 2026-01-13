export interface Card {
  cardId: string;
  brand: 'Visa' | 'MasterCard' | 'RuPay' | 'Amex';
  last4: string;
  expiry: string; // format: MM/YY
  default: boolean;
}
