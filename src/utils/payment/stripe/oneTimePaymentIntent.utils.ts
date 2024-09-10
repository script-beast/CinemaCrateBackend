import Stripe from 'stripe';

import userType from '../../../interfaces/payment/user.types';
import productType from '../../../interfaces/payment/product.types';

const oneTimePaymentIntent: (
  product: productType,
  cardDeduction: number,
  user: userType,
) => Promise<Stripe.Response<Stripe.PaymentIntent>> = async (
  product,
  cardDeduction,
  user,
) => {
  const myStripe = new Stripe(String(process.env.STRIPE_SECRET_KEY));

  const paymentIntent = await myStripe.paymentIntents.create({
    description: product.name,
    shipping: {
      name: user.name,
      address: {
        line1: user.address,
        city: user.city,
        state: user.state,
        postal_code: String(user.zip),
        country: user.country,
      },
      phone: String(user.mobile),
    },
    metadata: {
      product: String(product._id),
      user: String(user._id),
    },
    amount: cardDeduction,
    currency: 'inr',
    payment_method_types: ['cards', 'wallets'],
    receipt_email: user.email,
  });

  return paymentIntent;
};

export default oneTimePaymentIntent;
