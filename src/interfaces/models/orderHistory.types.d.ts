import orderCommonType from '../common/orderCommon';

type orderHistoryType = orderCommonType & {
  type: string;
};

export default orderHistoryType;
