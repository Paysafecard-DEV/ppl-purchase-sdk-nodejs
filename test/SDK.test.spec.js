require("dotenv").config();
const SDK = require("../");
const OperationStatus = require("../src/paysafe-paylater/model/OperationStatus");

const Communicator = SDK.communication.Communicator;
const Connection = SDK.connections.AxiosConnection;

const PurchaseLifecycleApi = SDK.api.PurchaseLifecycleApi;
const PurchaseAuthorizationApi = SDK.api.PurchaseAuthorizationApi;
const LegalDocumentsApi = SDK.api.LegalDocumentsApi;

const InitializePurchaseRequest = SDK.models.InitializePurchaseRequest;

const AuthorizePurchaseRequest = SDK.models.AuthorizePurchaseRequest;
const RefundPurchaseRequest = SDK.models.RefundPurchaseRequest;
const CapturePurchaseRequest = SDK.models.CapturePurchaseRequest;

const Amount = SDK.models.Amount;
const Currency = SDK.models.Currency;
const Consumer = SDK.models.Consumer;
const MethodType = SDK.models.MethodType;
const Country = SDK.models.Country;
const Address = SDK.models.Address;
const Person = SDK.models.Person;
const ProductType = SDK.models.ProductType;
const RefundReason = SDK.models.RefundReason;

const SECRET_KEY_DEFAULT_PROPERTY = "paysafe.paylater.api.secretKey";
const SECRET_KEY_INSTALLMENTS_PROPERTY = "paysafe.paylater.api.secretKeyInstallments";
const SECRET_KEY_INVOICE_PROPERTY = "paysafe.paylater.api.secretKeyInvoice";

const paysafePlSecretKeyInvoice = process.env[SECRET_KEY_INVOICE_PROPERTY];
const paysafePlSecretKeyInstallments = process.env[SECRET_KEY_INSTALLMENTS_PROPERTY];
const paysafePlSecretKeyDefault = process.env[SECRET_KEY_DEFAULT_PROPERTY];

const baseURL = "https://test-gateway.payolution.com";

let expectedPurchaseId;

function validateInitializeResponse(serverResponse, amountInCents, currency, productType) {
    expect(serverResponse).toHaveProperty("response");
    let purchaseOperationResponse = serverResponse.response;

    expect(purchaseOperationResponse.getResult().getStatus()).toBe(OperationStatus.OK);
    expect(purchaseOperationResponse.getResult().getStatusCode()).toBe("0.0.0");

    expect(purchaseOperationResponse.getPurchase().getPurchaseAmount().getAmount()).toBe(amountInCents);
    expect(purchaseOperationResponse.getPurchase().getPurchaseAmount().getCurrency()).toBe(currency);

    let opts = purchaseOperationResponse.getPurchase().getPaymentOptions();
    for (let i = 0; i < opts.length; i++) {
        expect(opts[i]["productType"]).toBe(productType);
    }
}

describe("SDK integration test", () => {
    describe("Purchase lifecycle API tests", () => {
        it("can initialize an invoice purchase", () => {
            const initRequest = new InitializePurchaseRequest(new Amount(50000, "EUR"));
            return getPurchaseLifeCycleApi()
                .initializePurchase(initRequest, paysafePlSecretKeyInvoice)
                .then((serverResponse) => {
                    validateInitializeResponse(serverResponse, 50000, "EUR", ProductType.INVOICE);
                });
        });

        it("can initialize an installment purchase", () => {
            const initRequest = new InitializePurchaseRequest(new Amount(30303, "EUR"));
            return getPurchaseLifeCycleApi()
                .initializePurchase(initRequest, paysafePlSecretKeyInstallments)
                .then((serverResponse) => {
                    validateInitializeResponse(serverResponse, 30303, "EUR", ProductType.INSTALLMENT);
                });
        });

        it("can retrieve an initialized purchase", () => {
            return initializePurchase(paysafePlSecretKeyDefault)
                .then((initializedPurchase) => {
                    const purchaseOperationResponse = initializedPurchase.response;
                    expect(purchaseOperationResponse.getResult().getStatus()).toBe("OK");

                    expectedPurchaseId = purchaseOperationResponse.getPurchase().getPurchaseId();
                    return getPurchaseLifeCycleApi().getPurchase(expectedPurchaseId, paysafePlSecretKeyDefault);
                })
                .then((apiResponse) => {
                    expect(apiResponse).toBeDefined();
                    expect(apiResponse.getResult().getStatus()).toBe("OK");
                    expect(apiResponse.getPurchase().getPurchaseId()).toBe(expectedPurchaseId);
                });
        });

        it("can retrieve an initialized payment with authorization", () => {
            return initializePurchase(paysafePlSecretKeyDefault).then((initializedPurchase) => {
                const purchaseOperationResponse = initializedPurchase.response;
                expect(purchaseOperationResponse.getResult().getStatus()).toBe("OK");
                let purchaseAuthorization = initializedPurchase.authorization;

                expectedPurchaseId = purchaseOperationResponse.getPurchase().getPurchaseId();
                return getPurchaseLifeCycleApi()
                    .getPurchaseWithAuthorization(expectedPurchaseId, purchaseAuthorization)
                    .then((apiResponse) => {
                        expect(apiResponse).toBeDefined();
                        expect(apiResponse.getResult().getStatus()).toBe("OK");
                        expect(apiResponse.getPurchase().getPurchaseId()).toBe(expectedPurchaseId);
                    });
            });
        });
    });

    describe("Purchase authorization API tests", () => {
        it("can authorize with sms", () => {
            return initializePurchase(paysafePlSecretKeyDefault)
                .then((initializedPurchase) => {
                    const purchaseOperationResponse = initializedPurchase.response;
                    expect(purchaseOperationResponse.getResult().getStatus()).toBe("OK");
                    const purchaseId = purchaseOperationResponse.getPurchase().getPurchaseId();
                    expectedPurchaseId = purchaseId;

                    const authorizationRequest = createAuthorizationRequest(purchaseId, MethodType.SMS);
                    return getPurchaseAuthApi().authorizePayLater(authorizationRequest, paysafePlSecretKeyDefault);
                })
                .then((apiResponse) => {
                    validateAuthorizeResponse(apiResponse);
                });
        });

        it("can authorize with url", () => {
            return initializePurchase(paysafePlSecretKeyDefault)
                .then((initializedPurchase) => {
                    const purchaseOperationResponse = initializedPurchase.response;
                    expect(purchaseOperationResponse.getResult().getStatus()).toBe("OK");
                    const purchaseId = purchaseOperationResponse.getPurchase().getPurchaseId();
                    expectedPurchaseId = purchaseId;

                    const authorizationRequest = createAuthorizationRequest(purchaseId, MethodType.URL);
                    return getPurchaseAuthApi().authorizePayLater(authorizationRequest, paysafePlSecretKeyDefault);
                })
                .then((apiResponse) => {
                    validateAuthorizeResponse(apiResponse);
                });
        });

        it("can authorize with url with authorization from purchase", () => {
            return initializePurchase(paysafePlSecretKeyDefault)
                .then((initializedPurchase) => {
                    const purchaseOperationResponse = initializedPurchase.response;
                    expect(purchaseOperationResponse.getResult().getStatus()).toBe("OK");
                    const purchaseId = purchaseOperationResponse.getPurchase().getPurchaseId();
                    expectedPurchaseId = purchaseId;

                    const authString = initializedPurchase.authorization;

                    const authorizationRequest = createAuthorizationRequest(purchaseId, MethodType.URL);
                    return getPurchaseAuthApi().authorizePayLaterWithAuthorization(authorizationRequest, authString);
                })
                .then((authResponse) => {
                    validateAuthorizeResponse(authResponse);
                });
        });
    });

    describe("Legal Document api tests", () => {
        it("it can request terms and conditions for a purchase", () => {
            return initializePurchase(paysafePlSecretKeyDefault).then((initializedPurchase) => {
                const purchaseOperationResponse = initializedPurchase.response;
                expect(purchaseOperationResponse.getResult().getStatus()).toBe("OK");
                const purchaseId = purchaseOperationResponse.getPurchase().getPurchaseId();

                return getLegalDocumentsApi()
                    .getTermsAndConditions(purchaseId, paysafePlSecretKeyDefault)
                    .then((terms) => {
                        expect(terms).toMatchSnapshot();
                    });
            });
        });

        it("it can request terms and conditions for a purchase with authorization", () => {
            return initializePurchase(paysafePlSecretKeyDefault).then((initializedPurchase) => {
                const purchaseOperationResponse = initializedPurchase.response;

                const purchaseAuthorization = initializedPurchase.authorization;

                expect(purchaseOperationResponse.getResult().getStatus()).toBe("OK");
                const purchaseId = purchaseOperationResponse.getPurchase().getPurchaseId();

                return getLegalDocumentsApi()
                    .getTermsAndConditionsWithAuthorization(purchaseId, purchaseAuthorization)
                    .then((terms) => {
                        expect(terms).toMatchSnapshot();
                    });
            });
        });
    });

    // This describes a full API flow, but is not able to run fully due to manual steps in between calls.
    // This test does not perform validations.
    describe.skip("Full API flow", () => {
        it("shows the full flow", () => {
            let initializeRequest = new InitializePurchaseRequest(new Amount(50000, Currency.EUR))
                .withConsumer(new Consumer()
                    .withEmail("instore-test@paysafe.com")
                    .withPhone("123456780")
                    .withPerson(new Person()
                        .withFirstName("Dieter")
                        .withLastName("Muller")
                        .withBirthdate(new Date(1990, 6, 21)))
                    .withBillingAddress(new Address()
                        .withStreet("Hauptstrasse")
                        .withHouseNumber("2")
                        .withZipCode("5500")
                        .withCity("Bischofshofen")
                        .withCountryCode(Country.AT)));

            getPurchaseLifeCycleApi()
                .initializePurchase(initializeRequest, paysafePlSecretKeyDefault)
                .then((initializeResponse) => {
                    const purchaseOperationResponse = initializeResponse.response;
                    const purchaseInformation = purchaseOperationResponse.getPurchase();

                    const purchaseAuthorization = initializeResponse.authorization;
                    const purchaseId = purchaseInformation.getPurchaseId();

                    // authorize the payment
                    const authorizePurchaseRequest = new AuthorizePurchaseRequest(purchaseId, MethodType.URL)
                        .withSuccessUrl("https://example.com/successUrl")
                        .withCallbackUrl("https://example.com/callbackUrl");

                    return getPurchaseAuthApi().authorizePayLaterWithAuthorization(
                        authorizePurchaseRequest,
                        purchaseAuthorization
                    );
                })
                .then((authorizationResponse) => {
                    const purchaseInformation = authorizationResponse.getPurchase();

                    // At this point the consumer should be redirected to the self-service authorisation URL to complete the application.
                    // The URL is part of the metadata of the authorizePurchase response.
                    const authUrl = purchaseInformation.getMetaData()["INSTORE_SELFSERVICE_AUTH_URL"];
                    console.log("auth URL: ", authUrl);

                    // After the application has been completed, the newly-created order ID becomes part of the purchase response
                    return getPurchaseLifeCycleApi().getPurchaseWithAuthorization(
                        purchaseInformation.getPurchaseId(),
                        paysafePlSecretKeyDefault
                    );
                })
                .then((updatedPurchaseResponse) => {
                    const purchaseInformation = updatedPurchaseResponse.getPurchase();

                    const merchantReference = purchaseInformation.getMerchantReference();
                    const orderId = merchantReference.getOrderId();

                    // This orderId is then used to capture the purchase funds.
                    // The amount to capture may be lower than the authorized amount
                    const capturePurchaseRequest = new CapturePurchaseRequest(new Amount(25000, Currency.EUR))
                        .withOrderId(orderId);

                    return getPurchaseLifeCycleApi().capturePurchase(capturePurchaseRequest, paysafePlSecretKeyDefault);
                })
                .then((captureResponse) => {
                    const purchaseInformation = captureResponse.getPurchase();

                    // The captured amount can be (partially) refunded:

                    const refundRequest = new RefundPurchaseRequest(purchaseInformation.getPurchaseId(), new Amount(5000, Currency.EUR))
                        .withReason(RefundReason.CUSTOMER_REFUND);

                    return getPurchaseLifeCycleApi().refundPurchase(refundRequest, paysafePlSecretKeyDefault);
                });
        });
    });

    describe("Error handling test", () => {
        // The order matters: After an AUTH error, the connection
        // becomes in a state that leads to a status 500 Error on the next call(s),
        // therefore the authentication error is last.

        it("API responds with a ReferenceException when purchase not found", () => {
            return getPurchaseLifeCycleApi()
                .getPurchase("INVALID_PURCHASE_ID", paysafePlSecretKeyDefault)
                .then(
                    (r) => {
                        r.fail("An AuthorizationException was expected but no Error was thrown");
                    },
                    (error) => {
                        expect(error).toBeInstanceOf(SDK.exceptions.ReferenceException);
                        expect(error.getResponseStatus()).toBe(404);
                        expect(error.getOperationResult()).toBeDefined();

                        let result = error.getOperationResult();
                        expect(result.getStatus()).toBe("NOK");
                        expect(result.getStatusCode()).toBe("4.2.0");
                    }
                );
        });

        it("API responds with an authentication error by sending a wrong key", () => {
            const initRequest = new InitializePurchaseRequest(new Amount(50000, "EUR"));
            return getPurchaseLifeCycleApi()
                .initializePurchase(initRequest, "INVALID_KEY")
                .then(
                    (r) => {
                        r.fail("An AuthorizationException was expected but no Error was thrown");
                    },
                    (error) => {
                        console.log(error);
                        expect(error).toBeInstanceOf(SDK.exceptions.AuthorizationException);
                        expect(error.getResponseStatus()).toBe(401);
                        expect(error.getOperationResult()).toBeDefined();

                        let result = error.getOperationResult();
                        expect(result.getStatus()).toBe("ERROR");
                        expect(result.getStatusCode()).toBe("4.5.0");
                    }
                );
        });
    });
});

function getLegalDocumentsApi() {
    const connection = new Connection({
        baseURL: baseURL,
    });
    return new LegalDocumentsApi(new Communicator(connection));
}

function getPurchaseLifeCycleApi() {
    const connection = new Connection({
        baseURL: baseURL,
    });
    return new PurchaseLifecycleApi(new Communicator(connection));
}

function getPurchaseAuthApi() {
    const connection = new Connection({
        baseURL: baseURL,
    });
    return new PurchaseAuthorizationApi(new Communicator(connection));
}

function initializePurchase(paysafeKey) {
    const initRequest = new InitializePurchaseRequest(new Amount(42000, "EUR")).withConsumer(
        new Consumer()
            .withEmail("paysafe-test@example.com")
            .withPhone("123456789")
            .withPerson(new Person()
                .withFirstName("Michael")
                .withLastName("Muller")
                .withBirthdate(new Date(1983, 3, 2)))
            .withBillingAddress(new Address()
                .withCountryCode(Country.AT)
                .withZipCode("5500")
                .withCity("Bischofshofen")
                .withStreet("Hauptstrasse")
                .withHouseNumber("2")));
    return getPurchaseLifeCycleApi()
        .initializePurchase(initRequest, paysafeKey)
        .then((initializedPurchase) => {
            expect(initializedPurchase).toHaveProperty("response");
            expect(initializedPurchase).toHaveProperty("authorization");
            return initializedPurchase;
        });
}

function createAuthorizationRequest(purchaseId, method) {
    return new AuthorizePurchaseRequest(purchaseId, method)
        .withPhone("+4300000000000")
        .withSuccessUrl("https://example.com/successUrl")
        .withCallbackUrl("https://example.com/callbackUrl");
}

function validateAuthorizeResponse(authResponse) {
    expect(authResponse.getResult().getStatus()).toBe("OK");
    let purchase = authResponse.getPurchase();
    expect(purchase.getPurchaseId()).toBe(expectedPurchaseId);
    let metadata = purchase.getMetaData();
    expect(metadata).toBeDefined();
    expect(metadata).toHaveProperty("INSTORE_SELFSERVICE_AUTH_URL");
}
