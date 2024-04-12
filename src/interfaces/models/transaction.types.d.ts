import orderCommonType from '../common/orderCommon';

type transactionType = orderCommonType & {
  paymentId: string;
  modeOfPayment: string;
};

export default transactionType;
