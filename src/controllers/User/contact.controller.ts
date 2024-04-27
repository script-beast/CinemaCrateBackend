import { Request, Response } from 'express';

import contactModel from '../../models/contact.model';

import catchAsync from '../../utils/errorHandling/catchAsync.utils';
import ExpressResponse from '../../libs/express/response.libs';

import { CreateContactSchemaType } from '../../validations/User/contact/createContact.zod';

class ContactController {
  public createContact = catchAsync(async (req: Request, res: Response) => {
    const { fName, lName, email, mobile, message } =
      req.body as CreateContactSchemaType;

    const contact = new contactModel({
      fName,
      lName,
      email,
      message,
      mobile,
    });

    await contact.save();

    return ExpressResponse.created(res, 'Contact created successfully');
  });
}

export default new ContactController();
