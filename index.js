const {Client, Config, CheckoutAPI} = require('@adyen/api-library');
const credentials = require('./credentials.json');
const config = new Config().assign({
    "apiKey":credentials.key;
    "merchantAccount": credentials.account;
});
const client = new Client({ config }).setEnvironment("TEST");
const checkout = new CheckoutAPI(client);
const paymentsResponse = checkout.paymentMethods({
    merchantAccount: config.merchantAccount,
    countryCode: "NL",
    shopperLocale: "nl-NL",
    amount: { currency: "EUR", value: 1000, },
    channel: "Web"
}).then(/*console.log*/);


/* Test: Generate API Keys */
const axios = require('axios').default;
axios({
  method: 'post',
  url: 'https://checkout-test.adyen.com/v1/originKeys',
  headers: {
      "x-api-key": config.apiKey,
      "Content-Type": "application/json"
  },
  data: {
   "originDomains":[
      "https://www.your-company1.com",
      "https://www.your-company2.com",
      "https://www.your-company3.com"
   ]
  }
}).then(console.log);


