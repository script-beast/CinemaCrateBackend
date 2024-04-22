const authorizenet = require('authorizenet');
const ApiContracts = authorizenet.APIContracts;
const ApiControllers = authorizenet.APIControllers;

const recurringMonthly = (cardDetails, product, user) => {
  const merchantAuthenticationType =
    new ApiContracts.MerchantAuthenticationType();
  merchantAuthenticationType.setName(process.env.AUTHORIZE_API_LOGIN_KEY);
  merchantAuthenticationType.setTransactionKey(
    process.env.AUTHORIZE_API_TRANSACTION_KEY,
  );

  // console.log(cardDetails, product, user);

  // Monthly subscription
  const interval = new ApiContracts.PaymentScheduleType.Interval();
  interval.setLength(1);
  interval.setUnit(ApiContracts.ARBSubscriptionUnitEnum.MONTHS);

  const paymentScheduleType = new ApiContracts.PaymentScheduleType();
  paymentScheduleType.setInterval(interval);
  paymentScheduleType.setStartDate(new Date().toISOString().substring(0, 10));
  paymentScheduleType.setTotalOccurrences(9999);
  paymentScheduleType.setTrialOccurrences(0);

  const creditCard = new ApiContracts.CreditCardType();
  creditCard.setCardNumber(cardDetails.number);
  creditCard.setExpirationDate(cardDetails.expiryDate);
  creditCard.setCardCode(cardDetails.cvc);

  const payment = new ApiContracts.PaymentType();
  payment.setCreditCard(creditCard);

  const orderType = new ApiContracts.OrderType();
  orderType.setInvoiceNumber(`INV-JP-${Math.floor(Math.random() * 1000000)}`);
  orderType.setDescription(`Monthly Subscription for ${product.name}`);

  const customer = new ApiContracts.CustomerType();
  customer.setType(ApiContracts.CustomerTypeEnum.INDIVIDUAL);
  customer.setId(`USR-JP-${user._id}`.substring(0, 18));
  customer.setEmail(user.email);

  const nameAndAddressType = new ApiContracts.NameAndAddressType();
  nameAndAddressType.setFirstName(user.name);
  nameAndAddressType.setLastName('.');
  nameAndAddressType.setAddress(user.address);
  nameAndAddressType.setCity(user.city);
  nameAndAddressType.setState(user.state);
  nameAndAddressType.setZip(user.zip);
  nameAndAddressType.setCountry(user.country);
  if (user.company) nameAndAddressType.setCompany(user.company);

  const arbSubscription = new ApiContracts.ARBSubscriptionType();
  arbSubscription.setName('Sample Subscription');
  arbSubscription.setPaymentSchedule(paymentScheduleType);
  arbSubscription.setAmount(parseFloat(product.monthlyPrice).toFixed(2));
  arbSubscription.setTrialAmount(0);
  arbSubscription.setPayment(payment);
  arbSubscription.setOrder(orderType);
  arbSubscription.setCustomer(customer);
  arbSubscription.setBillTo(nameAndAddressType);
  arbSubscription.setShipTo(nameAndAddressType);

  const createRequest = new ApiContracts.ARBCreateSubscriptionRequest();
  createRequest.setMerchantAuthentication(merchantAuthenticationType);
  createRequest.setSubscription(arbSubscription);

  const ctrl = new ApiControllers.ARBCreateSubscriptionController(
    createRequest.getJSON(),
  );

  ctrl.setEnvironment('https://api.authorize.net/xml/v1/request.api');

  return new Promise((resolve, reject) => {
    ctrl.execute(() => {
      const apiResponse = ctrl.getResponse();
      const response = new ApiContracts.ARBCreateSubscriptionResponse(
        apiResponse,
      );

      console.log(JSON.stringify(response, null, 2));

      if (response != null) {
        if (
          response.getMessages().getResultCode() ==
          ApiContracts.MessageTypeEnum.OK
        )
          resolve(response.getSubscriptionId());
        else {
          reject(response.getMessages().getMessage()[0].getText());
        }
      } else {
        reject('Null response received');
      }
    });
  });
};

module.exports = recurringMonthly;
