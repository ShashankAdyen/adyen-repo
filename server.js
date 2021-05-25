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
            res.json(response);
        })
        .catch(handleError);
});

app.post('/api/payments/details', function(req, res){
    console.log('/api/payments/details');
    checkout.paymentsDetails(req.body)
        .then(function(response){
            res.json(response);    
        })
        .catch(handleError);
});

app.post/*and .get*/('/api/handleShopperRedirect', function(req, res){
    console.log('/api/handleShopperRedirect');

});

app.post('/api/submitAdditonalDetails', function(req, res){
    console.log('/api/submitAdditonalDetails');

});

app.listen(8000);
