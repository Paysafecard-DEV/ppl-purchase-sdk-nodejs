/**
 * Purchase API
 * @copyright Copyright (c) 2020 Paysafe Pay Later
 * @license see LICENSE.TXT
 *
 * This class is based on the Paysafe Pay Later OpenAPI specification, version 1.0.0.
 */

const ModelHelper = require("../util/ModelHelper");
const Amount = require("./Amount");
const RefundReason = require("./RefundReason");

class RefundPurchaseRequest {
    /**
     * Constructor for all fields required by the object.
     * @param { String } purchaseId
     * @param { Amount } refundAmount
     */
    constructor(purchaseId, refundAmount) {
        this.purchaseId = ModelHelper.validatePrimitive(purchaseId, "string");
        this.refundAmount = ModelHelper.validateObject(refundAmount, Amount);
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
     * @returns { Amount }
     */
    getRefundAmount() {
        return this.refundAmount;
    }
    /**
     * @param { Amount } refundAmount
     */
    setRefundAmount(refundAmount) {
        this.refundAmount = ModelHelper.validateObject(refundAmount, Amount);
    }
    /**
     * @param { Amount } val
     */
    withRefundAmount(val) {
        this.setRefundAmount(val);
        return this;
    }

    /**
     * @returns { RefundReason }
     */
    getReason() {
        return this.reason;
    }
    /**
     * @param { RefundReason } reason
     */
    setReason(reason) {
        this.reason = ModelHelper.validateEnum(reason, RefundReason, "RefundReason");
    }
    /**
     * @param { RefundReason } val
     */
    withReason(val) {
        this.setReason(val);
        return this;
    }

    /**
     * @returns { RefundPurchaseRequest }
     */
    static constructFromObject(data) {
        if (!data) return undefined;
        const purchaseId = ModelHelper.convertToType(data["purchaseId"], String);
        const refundAmount = ModelHelper.convertToType(data["refundAmount"], Amount);
        return new RefundPurchaseRequest(purchaseId, refundAmount).withReason(ModelHelper.convertToType(data["reason"], RefundReason));
    }
}

module.exports = RefundPurchaseRequest;
