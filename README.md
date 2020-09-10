# Paysafe Pay Later Node.js SDK

The Paysafe Pay Later Node.js SDK lets you communicate with the [Paysafe Pay Later platform](https://www.paysafe.com/products-overview/paysafe-pay-later-home/developer-center/) and provides the following features:

* Handles authentication in all requests towards the API 
* Wrapper around all API calls and responses to make building a request and interpreting responses as easy as possible
* Takes care of marshalling and unmarshalling request and responses
* Processes errors from the API and transforms them in specific exceptions
* Handles decrypting of incoming webhook messages

## Documentation

The project contains multiple unit and integration tests that shows how to use the SDK.

For more examples and detailed information on how to use the SDK, you can go to the [Paysafe Pay Later Developer Hub](https://www.paysafe.com/products-overview/paysafe-pay-later-home/developer-center/).

### Integration tests and keys

The integration tests require keys for the PaySafe test API.
The repository does not include those keys. 
The secret keys for the integration tests are loaded using `dotenv` from a `.env` file.

|key|environment variable|
|-------|--------------|
|default key|paysafe.paylater.api.secretKey |
|installment key|paysafe.paylater.api.secretKeyInstallments|
|invoice key|paysafe.paylater.api.secretKeyInvoice|


## Installation

The Paysafe Pay Later Node.js SDK can be installed using [NPM](https://www.npmjs.com/) by including the following to the package.json file:

```json
"paysafe-paylater-sdk-nodejs": "^1.0.0"
```

### Requirements
The Paysafe Pay Later Node.js SDK requires Node.js version 10 or higher.

## Project structure

The project contains three components:

* `/src/paysafe-paylater/` which contains all source code of the SDK
* `/test/` which contains all unit and integration tests
