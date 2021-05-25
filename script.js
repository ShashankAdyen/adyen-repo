function makePayment(data){
   console.log('makePayment');
   return fetch("http://localhost:8000/api/makePayment", { 
       "method": "POST",
       "body": JSON.stringify({
            "merchantAccount" : "TestAccountNY",
            "amount"          : { currency: "USD", value: 1000, },
            "reference"       : "YOUR_ORDER_NUMBER",
            "paymentMethod"   : data.paymentMethod,
            "returnUrl"       : "http://localhost:8000"
       }),
       "headers": {
           "Content-type": "application/json; charset=UTF-8"
       }
   })
   .then(function(response){
       return response.json();
   })
   .catch(function(error){
       throw Error(error);
   });
}

function showFinalResult(response){
    alert('You did good lad, thanks for the moolah');
}

function onAdditionalDetails(stateData){
   return fetch("http://localhost:8000/api/payment/details", { 
       "method": "POST",
       "body": JSON.stringify(stateData),
       "headers": {
           "Content-type": "application/json; charset=UTF-8"
        }
   })
   .then(response => response.json())
   .catch(function(error){
      throw Error(error);
   });
}

function onSubmit(state, dropin){
  console.log('onSubmit');
  makePayment(state.data)
    .then(function(response){
      if (response.action) {
          dropin.handleAction(response.action);
      } else {
          showFinalResult(response);
      }
    })
    .catch(error => {
      throw Error(error);
    });
}

function getPaymentMethods(){
    console.log('getPaymentMethods');
   return fetch("http://localhost:8000/api/getPaymentMethods", { 
       "method": "POST",
       "body": JSON.stringify({
           "merchantAccount": "TestAccountNY"
       }),
       "headers": {
           "Content-type": "application/json; charset=UTF-8"
        }
   })
   .then(function(r){console.log(r); return r})
   .then(response => response.json())
   .catch(function(error){
      throw Error(error);
   });
}

let adyenCheckoutConfiguration = {
    "paymentMethodsResponse"     : null, // To be provided by the API call
    "originKey"/*"clientKey"*/   : "pub.v2.8115650120946270.aHR0cDovL2xvY2FsaG9zdDo4MDAw.zkoVizqsv4uttIICWCxh7zQ8yon0QwaISV5QrztZYE4",
    "locale"                     : "en-US",
    "environment"                : "test",
    "onSubmit"                   : onSubmit,
    "onAdditionalDetails"        : onAdditionalDetails,
    "onChange"                   : () => console.log('onChange'),
    "onError"                    : () => console.log('onError' )
};

getPaymentMethods()
    .then(function(response){
        Object.assign(adyenCheckoutConfiguration, {
            "paymentMethodsResponse": response
        });
        const checkout = new AdyenCheckout(adyenCheckoutConfiguration);
        const dropin = checkout.create('dropin')
           .mount('#dropin-container');
    })
    .catch(function(error){
        throw Error(error);
    });
