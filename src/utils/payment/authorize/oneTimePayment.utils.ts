// const authorizenet = require('authorizenet');
import authorizenet from 'authorizenet';
// import { APIContracts } from 'authorizenet';

const ApiContracts = authorizenet.APIContracts;
const ApiControllers = authorizenet.APIControllers;

const oneTimePayment = (cardDetails, product, cardDeduction, user) => {
  const merchantAuthenticationType =
    new ApiContracts.MerchantAuthenticationType();

  console.log(cardDetails, product, cardDeduction);

  merchantAuthenticationType.setName(
    String(process.env.AUTHORIZE_API_LOGIN_KEY),
  );
  merchantAuthenticationType.setTransactionKey(
    String(process.env.AUTHORIZE_API_TRANSACTION_KEY),
  );

  const creditCard = new ApiContracts.CreditCardType();
  creditCard.setCardNumber(cardDetails.number);
  creditCard.setExpirationDate(cardDetails.expiryDate);
  creditCard.setCardCode(cardDetails.cvc);

  const paymentType = new ApiContracts.PaymentType();
  paymentType.setCreditCard(creditCard);

  const orderDetails = new ApiContracts.OrderType();
  orderDetails.setInvoiceNumber(
    `INV-JP-${Math.floor(Math.random() * 1000000)}`,
  );
  orderDetails.setDescription(product.name);

  const billTo = new ApiContracts.CustomerAddressType();
  billTo.setFirstName(user.name);
  billTo.setLastName('.');
  billTo.setAddress(user.address);
  billTo.setCity(user.city);
  billTo.setState(user.state);
  billTo.setZip(user.zip);
  billTo.setCountry(user.country);
  if (user.company) billTo.setCompany(user.company);

  const shipTo = new ApiContracts.CustomerAddressType();
  shipTo.setFirstName(user.name);
  shipTo.setLastName('.');
  shipTo.setAddress(user.address);
  shipTo.setCity(user.city);
  shipTo.setState(user.state);
  shipTo.setZip(user.zip);
  shipTo.setCountry(user.country);
  if (user.company) shipTo.setCompany(user.company);

  const Item = new ApiContracts.LineItemType();
  Item.setItemId(product._id);
  Item.setName(product.name);
  Item.setQuantity(1);
  Item.setUnitPrice(product.price);

  const lineItems: authorizenet.APIContracts.LineItemType[] = [];
  lineItems.push(Item);

  const transactionSetting1 = new ApiContracts.SettingType();
  transactionSetting1.setSettingName('duplicateWindow');
  transactionSetting1.setSettingValue('120');

  const transactionSetting2 = new ApiContracts.SettingType();
  transactionSetting2.setSettingName('recurringBilling');
  transactionSetting2.setSettingValue('false');

  const transactionSettingList: authorizenet.APIContracts.SettingType[] = [];
  transactionSettingList.push(transactionSetting1);
  transactionSettingList.push(transactionSetting2);

  const transactionSettings = new ApiContracts.ArrayOfSetting();
  transactionSettings.setSetting(transactionSettingList);

  const transactionRequestType = new ApiContracts.TransactionRequestType();
  transactionRequestType.setTransactionType(
    ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION,
  );
  transactionRequestType.setPayment(paymentType);
  transactionRequestType.setAmount(parseFloat(cardDeduction).toFixed(2));
  transactionRequestType.setOrder(orderDetails);
  transactionRequestType.setTransactionSettings(transactionSettings);
  // transactionRequestType.setLineItems(lineItems);
  transactionRequestType.setBillTo(billTo);
  transactionRequestType.setShipTo(shipTo);

  const createRequest = new ApiContracts.CreateTransactionRequest();
  createRequest.setMerchantAuthentication(merchantAuthenticationType);
  createRequest.setTransactionRequest(transactionRequestType);

  const ctrl = new ApiControllers.CreateTransactionController(
    createRequest.getJSON(),
  );
  //set environment to sandbox
  // ctrl.setEnvironment("https://apitest.authorize.net/xml/v1/request.api");
  // set environment to production
  ctrl.setEnvironment('https://api.authorize.net/xml/v1/request.api');

  return new Promise((resolve, reject) => {
    ctrl.execute(() => {
      const apiResponse = ctrl.getResponse();
      const response = new ApiContracts.CreateTransactionResponse(apiResponse);
      console.log(JSON.stringify(response, null, 2));

      if (response != null) {
        if (
          response.getMessages().getResultCode() ==
            ApiContracts.MessageTypeEnum.OK &&
          response.getTransactionResponse().getErrors() == null
        )
          resolve(response.getMessages().getMessage()[0].getText());
        else {
          if (response.getTransactionResponse().getErrors() != null)
            reject(
              response
                .getTransactionResponse()
                .getErrors()
                .getError()[0]
                .getErrorText(),
            );
          else {
            reject(response.getMessages().getMessage()[0].getText());
          }
        }
      } else {
        reject('Null response received');
      }
    });
  });
};

module.exports = oneTimePayment;
