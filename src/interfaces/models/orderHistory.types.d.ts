import orderCommonType from '../common/orderCommon';

type orderHistoryType = orderCommonType & {
  desc: string;
  method: string;
  type: string;
};

export default orderHistoryType;
