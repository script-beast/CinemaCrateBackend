import stripe from 'stripe';

const oneTimePaymentIntent: (
  product: any,
  cardDeduction: any,
  user: any,
) => Promise<any> = async (product, cardDeduction, user) => {
  const myStripe = new stripe(String(process.env.STRIPE_SECRET_KEY));

  const paymentIntent = await myStripe.paymentIntents.create({
    description: product.name,
    shipping: {
      name: user.name,
      address: {
        line1: user.address,
        city: user.city,
        state: user.state,
        postal_code: user.zip,
        country: user.country,
      },
      phone: user.phone,
    },
    amount: cardDeduction,
    currency: 'inr',
    payment_method_types: ['cards'],
    receipt_email: user.email,
  });

  return paymentIntent;
};

export default oneTimePaymentIntent;
