import crateType from './crate.types';

type premiumCrateType = crateType & {
  monthlyPrice: number;
  yearlyPrice: number;
  discount: number;
};

export default premiumCrateType;
