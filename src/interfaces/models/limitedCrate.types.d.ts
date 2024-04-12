import crateType from './crate.types';

type limitedCrateType = crateType & {
  endTime: Date;
  discountPrice: number;
  occassion: string;
  tagLine: string;
};

export default limitedCrateType;
