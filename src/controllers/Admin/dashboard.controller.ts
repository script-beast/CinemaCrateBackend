import { Response, Request } from 'express';

import contactModel from '../../models/contact.model';
import orderHistoryModel from '../../models/orderHistory.model';
import crateModel from '../../models/crate.model';
import limitedCrateModel from '../../models/limitedCrate.model';
import premiumCrateModel from '../../models/premiumCrate.model';
import userModel from '../../models/user.model';

import catchAsync from '../../utils/ErrorHandling/catchAsync.utils';

class DashboardController {
  public getDashboard = catchAsync(async (req: Request, res: Response) => {
    const totalUsers = await userModel.countDocuments({
      isVerified: true,
      status: 'active',
    });
    const totalOrders = await orderHistoryModel.countDocuments();
    const totalContacts = await contactModel.countDocuments();
    const totalCrates = await crateModel.countDocuments();
    const totalLimitedCrates = await limitedCrateModel.countDocuments();
    const totalPremiumCrates = await premiumCrateModel.countDocuments();

    res.status(200).json({
      totalUsers,
      totalOrders,
      totalContacts,
      totalCrates,
      totalLimitedCrates,
      totalPremiumCrates,
    });
  });
}

export default DashboardController;
