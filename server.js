const express                       = require('express');
const app                           = express();
const credentials                   = require('./credentials.json');
const {Client, Config, CheckoutAPI} = require('@adyen/api-library');
const config                        = new Config();
config.apiKey                       = credentials.key;
config.merchantAccount              = credentials.account;
const client                        = new Client({ config });
client.setEnvironment("TEST");
const checkout                      = new CheckoutAPI(client);
const bodyParser                    = require('body-parser');

let temporaryStore = {};


function handleError(error){
    console.log(error);
    return Error(error);
}

app.use(bodyParser.json());

app.get('/', function(req,res){
    res.sendFile('./index.html', {root: __dirname});
});

app.get('/node_modules/@adyen/adyen-web/dist/adyen.js', function(req,res){
    res.sendFile('./node_modules/@adyen/adyen-web/dist/adyen.js', {root: __dirname});
});

app.get('/node_modules/@adyen/adyen-web/dist/adyen.css', function(req,res){
    res.sendFile('./node_modules/@adyen/adyen-web/dist/adyen.css', {root: __dirname});
});
app.get('/script.js', function(req,res){
    res.sendFile('./script.js', {root: __dirname});
});

app.post('/api/getPaymentMethods', function(req, res){
    console.log('/api/getPaymentMethods');
    checkout.paymentMethods(req.body)
        .then(function(response){
            res.json(response);
        })
        .catch(handleError);
});

app.post('/api/makePayment', function(req, res){
    console.log('/api/makePayment');
    checkout.payments(req.body)
        .then(function(response){
            if(response.action){
                temporaryStore[req.body.reference] = response.action.paymentData;
            }
            res.json(response);
        })
        .catch(handleError);
});

/* This route is untested */
app.post('/api/payments/details', function(req, res){
    console.log('/api/payments/details');
    const payload = {
        "details": req.body.details,
        "paymentData": req.body.paymentData || temporaryStore[req.body.reference]
    }
    checkout.paymentsDetails(payload)
        .then(function(response){
            res.json(response);    
        })
        .catch(handleError);
});

/* This route is untested, and is, for the most, a copy and paste from the integration guide */
app.all('/api/handleShopperRedirect', function(req, res){
  console.log('/api/handleShopperRedirect');
  const orderRef = req.query.orderRef;
  const redirect = req.method === "GET" ? req.query : req.body;
  const details = {};
  if (redirect.redirectResult) {
    details.redirectResult = redirect.redirectResult;
  } else {
    details.MD = redirect.MD;
    details.PaRes = redirect.PaRes;
  }
 
  const payload = {
    details,
    paymentData: temporaryStore[orderRef],
  };
 
  try {
    const response = checkout.paymentsDetails(payload)
        .then(function(){
            // Conditionally handle different result codes for the shopper
            switch (response.resultCode) {
              case "Authorised":
                res.write("/result/success");
                break;
              case "Pending":
              case "Received":
                res.write("/result/pending");
                break;
              case "Refused":
                res.write("/result/failed");
                break;
              default:
                res.write("/result/error");
                break;
            }
        });

  } catch (err) {
    console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
    res.write("/result/error");
  }
});

app.listen(8000);
