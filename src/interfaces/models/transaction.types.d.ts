import orderCommonType from '../common/orderCommon';

import { transactionStatus } from '../common/payment.enum';

type transactionType = orderCommonType & {
  paymentId: string;
  status: string;
};

export default transactionType;
