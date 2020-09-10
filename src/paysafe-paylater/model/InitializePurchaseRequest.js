/**
 * Purchase API
 * @copyright Copyright (c) 2020 Paysafe Pay Later
 * @license see LICENSE.TXT
 *
 * This class is based on the Paysafe Pay Later OpenAPI specification, version 1.0.0.
 */

const ModelHelper = require("../util/ModelHelper");
const Amount = require("./Amount");
const Consumer = require("./Consumer");
const MerchantReference = require("./MerchantReference");

class InitializePurchaseRequest {
    /**
     * Constructor for all fields required by the object.
     * @param { Amount } purchaseAmount
     */
    constructor(purchaseAmount) {
        this.purchaseAmount = ModelHelper.validateObject(purchaseAmount, Amount);
    }

    /**
     * @returns { Amount }
     */
    getPurchaseAmount() {
        return this.purchaseAmount;
    }
    /**
     * @param { Amount } purchaseAmount
     */
    setPurchaseAmount(purchaseAmount) {
        this.purchaseAmount = ModelHelper.validateObject(purchaseAmount, Amount);
    }
    /**
     * @param { Amount } val
     */
    withPurchaseAmount(val) {
        this.setPurchaseAmount(val);
        return this;
    }

    /**
     * @returns { Consumer }
     */
    getConsumer() {
        return this.consumer;
    }
    /**
     * @param { Consumer } consumer
     */
    setConsumer(consumer) {
        this.consumer = ModelHelper.validateObject(consumer, Consumer);
    }
    /**
     * @param { Consumer } val
     */
    withConsumer(val) {
        this.setConsumer(val);
        return this;
    }

    /**
     * @returns { MerchantReference }
     */
    getMerchantReference() {
        return this.merchantReference;
    }
    /**
     * @param { MerchantReference } merchantReference
     */
    setMerchantReference(merchantReference) {
        this.merchantReference = ModelHelper.validateObject(merchantReference, MerchantReference);
    }
    /**
     * @param { MerchantReference } val
     */
    withMerchantReference(val) {
        this.setMerchantReference(val);
        return this;
    }

    /**
     * Additional information provided as a key value map.

Shop information, when a merchant has multiple shops this assigns a specific transaction to a specific shop:
- PAYOLUTION_SHOP_ID
- PAYOLUTION_SHOP_NAME
- PAYOLUTION_SHOP_LEGAL_NAME

Customer registration, input for risk, increases acceptance rate:
- PAYOLUTION_CUSTOMER_REGISTRATION_DATE
- PAYOLUTION_CUSTOMER_REGISTRATION_LEVEL

Basket content, input for risk, increases acceptance rate:
- PAYOLUTION_ITEM_DESCR_1
- PAYOLUTION_ITEM_PRICE_1
- PAYOLUTION_ITEM_TAX_1

Fulfillment dates, delays due date for customer:
- PAYOLUTION_FULFILLMENT_START
- PAYOLUTION_FULFILLMENT_END
     * @returns { String }
     */
    getAdditionalInformation() {
        return this.additionalInformation;
    }
    /**
     * Additional information provided as a key value map.

Shop information, when a merchant has multiple shops this assigns a specific transaction to a specific shop:
- PAYOLUTION_SHOP_ID
- PAYOLUTION_SHOP_NAME
- PAYOLUTION_SHOP_LEGAL_NAME

Customer registration, input for risk, increases acceptance rate:
- PAYOLUTION_CUSTOMER_REGISTRATION_DATE
- PAYOLUTION_CUSTOMER_REGISTRATION_LEVEL

Basket content, input for risk, increases acceptance rate:
- PAYOLUTION_ITEM_DESCR_1
- PAYOLUTION_ITEM_PRICE_1
- PAYOLUTION_ITEM_TAX_1

Fulfillment dates, delays due date for customer:
- PAYOLUTION_FULFILLMENT_START
- PAYOLUTION_FULFILLMENT_END
     * @param { String } additionalInformation
     */
    setAdditionalInformation(additionalInformation) {
        this.additionalInformation = ModelHelper.validatePrimitive(additionalInformation, "string");
    }
    /**
     * Additional information provided as a key value map.

Shop information, when a merchant has multiple shops this assigns a specific transaction to a specific shop:
- PAYOLUTION_SHOP_ID
- PAYOLUTION_SHOP_NAME
- PAYOLUTION_SHOP_LEGAL_NAME

Customer registration, input for risk, increases acceptance rate:
- PAYOLUTION_CUSTOMER_REGISTRATION_DATE
- PAYOLUTION_CUSTOMER_REGISTRATION_LEVEL

Basket content, input for risk, increases acceptance rate:
- PAYOLUTION_ITEM_DESCR_1
- PAYOLUTION_ITEM_PRICE_1
- PAYOLUTION_ITEM_TAX_1

Fulfillment dates, delays due date for customer:
- PAYOLUTION_FULFILLMENT_START
- PAYOLUTION_FULFILLMENT_END
     * @param { String } val
     */
    withAdditionalInformation(val) {
        this.setAdditionalInformation(val);
        return this;
    }

    /**
     * @returns { InitializePurchaseRequest }
     */
    static constructFromObject(data) {
        if (!data) return undefined;
        const purchaseAmount = ModelHelper.convertToType(data["purchaseAmount"], Amount);
        return new InitializePurchaseRequest(purchaseAmount)
            .withConsumer(ModelHelper.convertToType(data["consumer"], Consumer))
            .withMerchantReference(ModelHelper.convertToType(data["merchantReference"], MerchantReference))
            .withAdditionalInformation(ModelHelper.convertToType(data["additionalInformation"], String));
    }
}

module.exports = InitializePurchaseRequest;
