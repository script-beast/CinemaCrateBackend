import Stripe from 'stripe';

import userType from '../../../interfaces/payment/user.types';
import productType from '../../../interfaces/payment/product.types';

const recurringMonthlyIntent: (
  product: productType,
  cardDeduction: number,
  user: userType,
  customerId: string,
) => Promise<Stripe.Response<Stripe.Subscription>> = async (
  product,
  cardDeduction,
  user,
  customerId,
) => {
  const myStripe = new Stripe(String(process.env.STRIPE_SECRET_KEY));

  const paymentIntent = await myStripe.subscriptions.create({
    customer: customerId,
    currency: 'inr',
    items: [{ price: String(cardDeduction) }],
    payment_settings: {
      payment_method_types: ['card'],
      save_default_payment_method: 'on_subscription',
    },
    expand: ['latest_invoice.payment_intent'],
  });

  return paymentIntent;
};

export default recurringMonthlyIntent;
