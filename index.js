const {Client, Config, CheckoutAPI} = require('@adyen/api-library');
const config = new Config();
// Set your X-API-KEY with the API key from the Customer Area.
config.apiKey = 'AQEyhmfxK4zJbBZDw0m/n3Q5qf3VaY9UCJ1+XWZe9W27jmlZiniYHPZ+YtXG9dYfNdwN0H8QwV1bDb7kfNy1WIxIIkxgBw==-uA2G0DS73SlmB4EHi/YNndhli7KlCMjXHbMmm8stboc=-djvcdM2gNHq9dSvC';
config.merchantAccount = 'TestAccountNY';
const client = new Client({ config });
client.setEnvironment("TEST");
const checkout = new CheckoutAPI(client);
const paymentsResponse = checkout.paymentMethods({
    merchantAccount: config.merchantAccount,
    countryCode: "NL",
    shopperLocale: "nl-NL",
    amount: { currency: "EUR", value: 1000, },
    channel: "Web"
}).then(/*console.log*/);

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
