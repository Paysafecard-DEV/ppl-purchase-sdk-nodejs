/**
 * Purchase API
 * @copyright Copyright (c) 2020 Paysafe Pay Later
 * @license see LICENSE.TXT
 *
 * This class is based on the Paysafe Pay Later OpenAPI specification, version 1.0.0.
 */

const ModelHelper = require("../util/ModelHelper");
const Amount = require("./Amount");
const DeliveryInformation = require("./DeliveryInformation");

class CapturePurchaseRequest {
    /**
     * Constructor for all fields required by the object.
     * @param { Amount } fulfillmentAmount
     */
    constructor(fulfillmentAmount) {
        this.fulfillmentAmount = ModelHelper.validateObject(fulfillmentAmount, Amount);
    }

    /**
     * PurchaseId received from initializePurchase or authorizePurchase response.
     * @returns { String }
     */
    getPurchaseId() {
        return this.purchaseId;
    }
    /**
     * PurchaseId received from initializePurchase or authorizePurchase response.
     * @param { String } purchaseId
     */
    setPurchaseId(purchaseId) {
        this.purchaseId = ModelHelper.validatePrimitive(purchaseId, "string");
    }
    /**
     * PurchaseId received from initializePurchase or authorizePurchase response.
     * @param { String } val
     */
    withPurchaseId(val) {
        this.setPurchaseId(val);
        return this;
    }

    /**
     * OrderId received after the consumer has completed the transaction from getPurchase response or callback message.
     * @returns { String }
     */
    getOrderId() {
        return this.orderId;
    }
    /**
     * OrderId received after the consumer has completed the transaction from getPurchase response or callback message.
     * @param { String } orderId
     */
    setOrderId(orderId) {
        this.orderId = ModelHelper.validatePrimitive(orderId, "string");
    }
    /**
     * OrderId received after the consumer has completed the transaction from getPurchase response or callback message.
     * @param { String } val
     */
    withOrderId(val) {
        this.setOrderId(val);
        return this;
    }

    /**
     * @returns { Amount }
     */
    getFulfillmentAmount() {
        return this.fulfillmentAmount;
    }
    /**
     * @param { Amount } fulfillmentAmount
     */
    setFulfillmentAmount(fulfillmentAmount) {
        this.fulfillmentAmount = ModelHelper.validateObject(fulfillmentAmount, Amount);
    }
    /**
     * @param { Amount } val
     */
    withFulfillmentAmount(val) {
        this.setFulfillmentAmount(val);
        return this;
    }

    /**
     * This flag indicates if the purchase can be closed.
     * @returns { Boolean }
     */
    getClosePurchase() {
        return this.closePurchase;
    }
    /**
     * This flag indicates if the purchase can be closed.
     * @param { Boolean } closePurchase
     */
    setClosePurchase(closePurchase) {
        this.closePurchase = ModelHelper.validateBoolean(closePurchase);
    }
    /**
     * This flag indicates if the purchase can be closed.
     * @param { Boolean } val
     */
    withClosePurchase(val) {
        this.setClosePurchase(val);
        return this;
    }

    /**
     * @returns { DeliveryInformation }
     */
    getDeliveryInformation() {
        return this.deliveryInformation;
    }
    /**
     * @param { DeliveryInformation } deliveryInformation
     */
    setDeliveryInformation(deliveryInformation) {
        this.deliveryInformation = ModelHelper.validateObject(deliveryInformation, DeliveryInformation);
    }
    /**
     * @param { DeliveryInformation } val
     */
    withDeliveryInformation(val) {
        this.setDeliveryInformation(val);
        return this;
    }

    /**
     * @returns { CapturePurchaseRequest }
     */
    static constructFromObject(data) {
        if (!data) return undefined;
        const fulfillmentAmount = ModelHelper.convertToType(data["fulfillmentAmount"], Amount);
        return new CapturePurchaseRequest(fulfillmentAmount)
            .withPurchaseId(ModelHelper.convertToType(data["purchaseId"], String))
            .withOrderId(ModelHelper.convertToType(data["orderId"], String))
            .withClosePurchase(ModelHelper.convertToType(data["closePurchase"], Boolean))
            .withDeliveryInformation(ModelHelper.convertToType(data["deliveryInformation"], DeliveryInformation));
    }
}

module.exports = CapturePurchaseRequest;
