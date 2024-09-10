import Stripe from 'stripe';

import userType from '../../../interfaces/payment/user.types';

const createCustomer: (user: userType) => Promise<Stripe.Customer> = async (
  user,
) => {
  const myStripe = new Stripe(String(process.env.STRIPE_SECRET_KEY));

  const customer = await myStripe.customers.create({
    name: user.name,
    email: user.email,
    phone: String(user.mobile),
    address: {
      line1: user.address,
      city: user.city,
      state: user.state,
      postal_code: String(user.zip),
      country: user.country,
    },
    metadata: {
      user: String(user._id),
    },
  });

  return customer;
};

export default createCustomer;
