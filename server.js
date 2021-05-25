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
    checkout.paymentMethods(req.body)
        .then(function(response){
            res.json(response);
        })
        .catch(function(error){
            throw Error(error);
        });
});

app.post('/api/makePayment', function(req, res){
    checkout.payments(req.body)
        .then(function(response){
            res.json(response);
        })
        .catch(function(error){
            throw Error(error)
        });
});

app.post('/api/payments/details', function(req, res){
    checkout.paymentsDetails(STATE_DATA)
        .then(function(response){
            res.json(response);    
        })
        .catch(function(error){
            throw Error(error);
        });
});

app.post/*and .get*/('/api/handleShopperRedirect', function(req, res){

});

app.post('/api/submitAdditonalDetails', function(req, res){

});

app.listen(8000);
