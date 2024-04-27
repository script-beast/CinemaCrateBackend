import { Request, Response } from 'express';
import mongoose from 'mongoose';

import contactModel from '../../models/contact.model';

import catchAsync from '../../utils/errorHandling/catchAsync.utils';
import ExpressResponse from '../../libs/express/response.libs';

import { ReplyContactSchemaType } from '../../validations/Admin/contact/replyContact.zod';

class ContactController {
  public getAllContacts = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const totalPages = Math.ceil(
      (await contactModel.countDocuments({})) / limit,
    );

    const result = await contactModel
      .find({})
      .skip((page - 1) * limit)
      .limit(limit);

    return ExpressResponse.success(res, 'Success', { result, totalPages });
  });

  public getSingleContact = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ExpressResponse.badRequest(res, 'Invalid ID');
    }

    const result = await contactModel.findById(id);

    if (!result) {
      return ExpressResponse.notFound(res, 'Contact not found');
    }

    return ExpressResponse.success(res, 'Success', { result });
  });

  public replyContact = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { reply } = req.body as ReplyContactSchemaType;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ExpressResponse.badRequest(res, 'Invalid ID');
    }

    const contact = await contactModel.findById(id);

    if (!contact) {
      return ExpressResponse.notFound(res, 'Contact not found');
    }

    // send mail to user

    contact.isReplied = true;
    await contact.save();

    return ExpressResponse.accepted(res, 'Reply sent successfully');
  });
}

export default new ContactController();
