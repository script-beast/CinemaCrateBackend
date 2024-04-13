import orderCommonType from '../common/orderCommon';

type transactionType = orderCommonType & {
  paymentId: string;
};

export default transactionType;
