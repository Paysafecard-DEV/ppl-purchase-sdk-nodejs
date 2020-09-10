/**
 * Purchase API
 * @copyright Copyright (c) 2020 Paysafe Pay Later
 * @license see LICENSE.TXT
 *
 * This class is based on the Paysafe Pay Later OpenAPI specification, version 1.0.0.
 */

"use strict";

const CapturePurchaseRequest = require("../model/CapturePurchaseRequest");
const InitializePurchaseRequest = require("../model/InitializePurchaseRequest");
const PurchaseOperationResponse = require("../model/PurchaseOperationResponse");
const RefundPurchaseRequest = require("../model/RefundPurchaseRequest");
const { populateUri } = require("../util/ApiHelper");

/**
 * @class PurchaseLifecycleApi
 *
 *
 */
class PurchaseLifecycleApi {
    constructor(communicator) {
        this.communicator = communicator;
    }

    /**
     * Confirm a capture(&#x3D;shipping) of the purchased goods.
     * PurchaseLifecycle endpoints always return the same object with the latest state of the purchase and different fields populated.PurchaseLifecycle endpoints also return the same object when an error occurs. The purchase object however will be null. PurchaseLifecycle endpoints also return the same object when an error occurs. The purchase object however will be null. PurchaseLifecycle endpoints also return the same object when an error occurs. The purchase object however will be null. PurchaseLifecycle endpoints also return the same object when an error occurs. The purchase object however will be null. PurchaseLifecycle endpoints also return the same object when an error occurs. The purchase object however will be null.
     *
     * @param capturePurchaseRequest Contains all data needed to process a capture(&#x3D;shipping) of purchased goods.
     * @param paysafePlSecretKey Secret key which can be requested from your account manager. Only use this for server-to-server communication.
     * @return { Promise<PurchaseOperationResponse> } a Promise that will return a PurchaseOperationResponse.
     */
    capturePurchase(capturePurchaseRequest, paysafePlSecretKey) {
        const uri = "/purchase/capture";
        const request =
            capturePurchaseRequest instanceof CapturePurchaseRequest
                ? capturePurchaseRequest
                : CapturePurchaseRequest.constructFromObject(capturePurchaseRequest);

        const headerParams = {
            "paysafe-pl-secret-key": paysafePlSecretKey,
        };

        return this.communicator
            .execute("POST", uri, headerParams, capturePurchaseRequest)
            .then((r) => PurchaseOperationResponse.constructFromObject(r.data));
    }

    /**
     * Query for a purchase for a given purchaseId.
     * PurchaseLifecycle endpoints always return the same object with the latest state of the purchase and different fields populated.PurchaseLifecycle endpoints also return the same object when an error occurs. The purchase object however will be null. PurchaseLifecycle endpoints also return the same object when an error occurs. The purchase object however will be null. PurchaseLifecycle endpoints also return the same object when an error occurs. The purchase object however will be null. PurchaseLifecycle endpoints also return the same object when an error occurs. The purchase object however will be null. PurchaseLifecycle endpoints also return the same object when an error occurs. The purchase object however will be null.
     *
     * @param purchaseId PurchaseId received from initializePurchase or authorizePurchase response.
     * @param authorization The access token received from the initialize request. Provide this for client-side requests in the Bearer format.
     * @return { Promise<PurchaseOperationResponse> } a Promise that will return a PurchaseOperationResponse.
     */
    getPurchaseWithAuthorization(purchaseId, authorization) {
        const uri = populateUri("/purchase/info/{purchaseId}", ["purchaseId"], [purchaseId]);

        const headerParams = {
            Authorization: authorization,
        };

        return this.communicator.execute("GET", uri, headerParams, null).then((r) => PurchaseOperationResponse.constructFromObject(r.data));
    }

    /**
     * Query for a purchase for a given purchaseId.
     * PurchaseLifecycle endpoints always return the same object with the latest state of the purchase and different fields populated.PurchaseLifecycle endpoints also return the same object when an error occurs. The purchase object however will be null. PurchaseLifecycle endpoints also return the same object when an error occurs. The purchase object however will be null. PurchaseLifecycle endpoints also return the same object when an error occurs. The purchase object however will be null. PurchaseLifecycle endpoints also return the same object when an error occurs. The purchase object however will be null. PurchaseLifecycle endpoints also return the same object when an error occurs. The purchase object however will be null.
     *
     * @param purchaseId PurchaseId received from initializePurchase or authorizePurchase response.
     * @param paysafePlSecretKey Secret key which can be requested from your account manager. Only use this for server-to-server communication.
     * @return { Promise<PurchaseOperationResponse> } a Promise that will return a PurchaseOperationResponse.
     */
    getPurchase(purchaseId, paysafePlSecretKey) {
        const uri = populateUri("/purchase/info/{purchaseId}", ["purchaseId"], [purchaseId]);

        const headerParams = {
            "paysafe-pl-secret-key": paysafePlSecretKey,
        };

        return this.communicator.execute("GET", uri, headerParams, null).then((r) => PurchaseOperationResponse.constructFromObject(r.data));
    }

    /**
     * Initializes a purchase for a given amount and returns a response with all pre-configured (non-binding) payment options.
     * PurchaseLifecycle endpoints always return the same object with the latest state of the purchase and different fields populated.  In addition, the initialize operation returns a single-purchase authentication token in the response header <<access_token>>. This token has to be used by client-side callers. PurchaseLifecycle endpoints also return the same object when an error occurs. The purchase object however will be null. PurchaseLifecycle endpoints also return the same object when an error occurs. The purchase object however will be null. PurchaseLifecycle endpoints also return the same object when an error occurs. The purchase object however will be null. PurchaseLifecycle endpoints also return the same object when an error occurs. The purchase object however will be null. PurchaseLifecycle endpoints also return the same object when an error occurs. The purchase object however will be null.
     *
     * @param initializePurchaseRequest Contains the data needed to initialize a purchase.
     * @param paysafePlSecretKey Secret key which can be requested from your account manager. Only use this for server-to-server communication.
     * @return { Promise<{ response: PurchaseOperationResponse, authorization: String}> } a Promise that will return an object consisting of { response: PurchaseOperationResponse, Authorization: String }. The authorization value is used instead of the secret key in client-side requests.
     */
    initializePurchase(initializePurchaseRequest, paysafePlSecretKey) {
        const uri = "/purchase/initialize";
        const request =
            initializePurchaseRequest instanceof InitializePurchaseRequest
                ? initializePurchaseRequest
                : InitializePurchaseRequest.constructFromObject(initializePurchaseRequest);

        const headerParams = {
            "paysafe-pl-secret-key": paysafePlSecretKey,
        };

        return this.communicator
            .executeWithAuthorizationHeader("POST", uri, headerParams, initializePurchaseRequest)
            .then((r) => ({ response: PurchaseOperationResponse.constructFromObject(r.data), authorization: r.authorization }));
    }

    /**
     * Refund part of or the full purchase amount in case consumer returned purchased goods.
     * PurchaseLifecycle endpoints always return the same object with the latest state of the purchase and different fields populated.PurchaseLifecycle endpoints also return the same object when an error occurs. The purchase object however will be null. PurchaseLifecycle endpoints also return the same object when an error occurs. The purchase object however will be null. PurchaseLifecycle endpoints also return the same object when an error occurs. The purchase object however will be null. PurchaseLifecycle endpoints also return the same object when an error occurs. The purchase object however will be null. PurchaseLifecycle endpoints also return the same object when an error occurs. The purchase object however will be null.
     *
     * @param refundPurchaseRequest All data needed to process a refund of a purchase.
     * @param paysafePlSecretKey Secret key which can be requested from your account manager. Only use this for server-to-server communication.
     * @return { Promise<PurchaseOperationResponse> } a Promise that will return a PurchaseOperationResponse.
     */
    refundPurchase(refundPurchaseRequest, paysafePlSecretKey) {
        const uri = "/purchase/refund";
        const request =
            refundPurchaseRequest instanceof RefundPurchaseRequest
                ? refundPurchaseRequest
                : RefundPurchaseRequest.constructFromObject(refundPurchaseRequest);

        const headerParams = {
            "paysafe-pl-secret-key": paysafePlSecretKey,
        };

        return this.communicator
            .execute("POST", uri, headerParams, refundPurchaseRequest)
            .then((r) => PurchaseOperationResponse.constructFromObject(r.data));
    }
}

module.exports = PurchaseLifecycleApi;
