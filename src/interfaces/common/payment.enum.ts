export enum paymentGateway {
  STRIPE = 'Stripe',
  RAZORPAY = 'Razorpay',
  GIFTED = 'Gifted',
  WALLET = 'Wallet',
  AUTHORIZE = 'Authorize.Net',
}

export enum product {
  STORE = 'Store',
  CRATE = 'Crate',
  LIMITEDCRATE = 'Limited Crate',
}

export enum transactionStatus {
  SUCCESS = 'Success',
  FAILED = 'Failed',
  PENDING = 'Pending',
}

// export enum paymentMethod {
//   WALLET = 'Wallet',
//   CARD = 'Card',
//   GIFT = 'Gift',
// }

export enum paymentType {
  CREDIT = 'Credit',
  DEBIT = 'Debit',
  GIFT = 'Gift',
}
