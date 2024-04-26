import mongoose from 'mongoose';
import { Response, Request } from 'express';

import userDataModel from '../../models/userData.model';
import crateModel from '../../models/crate.model';
import orderHistoryModel from '../../models/orderHistory.model';

import catchAsync from '../../utils/errorHandling/catchAsync.utils';

import ExpressResponse from '../../libs/express/response.libs';

class CartController {
  public addToCart = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ExpressResponse.badRequest(res, 'Invalid ID');
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return ExpressResponse.badRequest(res, 'Invalid User ID');
    }

    const crate = await crateModel.findById(id);

    if (!crate) {
      return ExpressResponse.notFound(res, 'Crate not found');
    }

    const user = await userDataModel.findOne({ userId });

    if (!user) {
      return ExpressResponse.notFound(res, 'User not found');
    }

    const crateId = new mongoose.Types.ObjectId(id);

    if (user.cart.includes(crateId)) {
      return ExpressResponse.badRequest(res, 'Crate already in cart');
    }

    user.cart.push(crateId);

    await user.save();

    ExpressResponse.accepted(res, 'Crate added to cart');
  });

  public removeFromCart = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ExpressResponse.badRequest(res, 'Invalid ID');
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return ExpressResponse.badRequest(res, 'Invalid User ID');
    }

    const user = await userDataModel.findOne({ userId });

    if (!user) {
      return ExpressResponse.notFound(res, 'User not found');
    }

    const crateId = new mongoose.Types.ObjectId(id);

    if (!user.cart.includes(crateId)) {
      return ExpressResponse.badRequest(res, 'Crate not in cart');
    }

    user.cart = user.cart.filter((item) => item.toString() !== id);

    await user.save();

    ExpressResponse.accepted(res, 'Crate removed from cart');
  });

  public getCart = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return ExpressResponse.badRequest(res, 'Invalid User ID');
    }

    const user = await userDataModel.findOne({ userId });

    if (!user) {
      return ExpressResponse.notFound(res, 'User not found');
    }

    const cart = await userDataModel.aggregate([
      { $match: { userId } },
      {
        $unwind: '$cart',
      },
      {
        $lookup: {
          from: 'crates',
          localField: 'cart',
          foreignField: '_id',
          as: 'cart',
        },
      },
    ]);

    ExpressResponse.success(res, 'Success', { result: cart });
  });

  public clearCart = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return ExpressResponse.badRequest(res, 'Invalid User ID');
    }

    const user = await userDataModel.findOne({ userId });

    if (!user) {
      return ExpressResponse.notFound(res, 'User not found');
    }

    user.cart = [];

    await user.save();

    ExpressResponse.accepted(res, 'Cart cleared');
  });

  public checkoutCart = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return ExpressResponse.badRequest(res, 'Invalid User ID');
    }

    const user = await userDataModel.findOne({ userId });

    if (!user) {
      return ExpressResponse.notFound(res, 'User not found');
    }

    if (user.cart.length === 0) {
      return ExpressResponse.badRequest(res, 'Cart is empty');
    }

    const userCart = user.cart;

    // Add cart to user's orders

    userCart.forEach(async (item) => {
      const crate = await crateModel
        .findById(item)
        .select('name price description');

      if (!crate) {
        return ExpressResponse.notFound(res, 'Crate not found');
      }

      const order = {
        userId,
        crateId: item,
        name: crate.name,
        price: crate.price,
        description: `${crate.name} buied `,
        method: 'Cart',
        status: 'Pending',
        type: 'Debit',
        gateway: 'Store',
      };

      const orderHistory = new orderHistoryModel(order);

      orderHistory.save();

      user.orderHistory.push(orderHistory._id);

      await user.save();
    });

    user.cart = [];

    await user.save();

    ExpressResponse.accepted(res, 'Cart checked out');
  });
}

export default new CartController();