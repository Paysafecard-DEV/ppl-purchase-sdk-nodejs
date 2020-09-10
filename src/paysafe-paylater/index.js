/**
 * Purchase API
 * @copyright Copyright (c) 2020 Paysafe Pay Later
 * @license see LICENSE.TXT
 *
 * This class is based on the Paysafe Pay Later OpenAPI specification, version 1.0.0.
 */

exports.api = {
    LegalDocumentsApi: require("./api/LegalDocumentsApi"),
    PurchaseAuthorizationApi: require("./api/PurchaseAuthorizationApi"),
    PurchaseLifecycleApi: require("./api/PurchaseLifecycleApi"),
};

exports.models = {
    Account: require("./model/Account"),
    Ach: require("./model/Ach"),
    AchAccountType: require("./model/AchAccountType"),
    Address: require("./model/Address"),
    Amount: require("./model/Amount"),
    AuthorizePurchaseRequest: require("./model/AuthorizePurchaseRequest"),
    Bacs: require("./model/Bacs"),
    CapturePurchaseRequest: require("./model/CapturePurchaseRequest"),
    Company: require("./model/Company"),
    Consumer: require("./model/Consumer"),
    ConsumerVerification: require("./model/ConsumerVerification"),
    Contract: require("./model/Contract"),
    Country: require("./model/Country"),
    Currency: require("./model/Currency"),
    DeliveryAddress: require("./model/DeliveryAddress"),
    DeliveryInformation: require("./model/DeliveryInformation"),
    DeliveryType: require("./model/DeliveryType"),
    Document: require("./model/Document"),
    DocumentType: require("./model/DocumentType"),
    Eft: require("./model/Eft"),
    InitializePurchaseRequest: require("./model/InitializePurchaseRequest"),
    Language: require("./model/Language"),
    LogisticsProvider: require("./model/LogisticsProvider"),
    MerchantReference: require("./model/MerchantReference"),
    MethodType: require("./model/MethodType"),
    Occupation: require("./model/Occupation"),
    OperationInformation: require("./model/OperationInformation"),
    OperationResult: require("./model/OperationResult"),
    OperationStatus: require("./model/OperationStatus"),
    Payment: require("./model/Payment"),
    PaymentInformation: require("./model/PaymentInformation"),
    PaymentMethod: require("./model/PaymentMethod"),
    PaymentOption: require("./model/PaymentOption"),
    Person: require("./model/Person"),
    ProductType: require("./model/ProductType"),
    PurchaseInformation: require("./model/PurchaseInformation"),
    PurchaseOperationResponse: require("./model/PurchaseOperationResponse"),
    PurchaseState: require("./model/PurchaseState"),
    RefundPurchaseRequest: require("./model/RefundPurchaseRequest"),
    RefundReason: require("./model/RefundReason"),
    Sepa: require("./model/Sepa"),
};

exports.communication = {
    Communicator: require("./communication/Communicator"),
};

exports.connections = {
    AxiosConnection: require("./connection/AxiosConnection"),
    BaseConnection: require("./connection/BaseConnection"),
};

exports.logging = {
    Logger: require("./logging/Logger"),
    ConsoleLogger: require("./logging/ConsoleLogger"),
};

exports.exceptions = {
    ApiException: require("./exceptions/ApiException"),
    AuthorizationException: require("./exceptions/AuthorizationException"),
    PaysafeException: require("./exceptions/PaysafeException"),
    ReferenceException: require("./exceptions/ReferenceException"),
    ValidationException: require("./exceptions/ValidationException"),
};
