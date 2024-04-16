import {z} from 'zod';

import reqCrateSchema from '../crate/reqCrate.zod';

// endTime,
// discountPrice,
// occassion,
// tagLine,

const reqLimitedCrateSchema = reqCrateSchema.extend({
  
});