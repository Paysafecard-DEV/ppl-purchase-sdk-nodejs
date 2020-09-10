/**
 * Purchase API
 * @copyright Copyright (c) 2020 Paysafe Pay Later
 * @license see LICENSE.TXT
 *
 * This class is based on the Paysafe Pay Later OpenAPI specification, version 1.0.0.
 */

const ValidationException = require("../exceptions/ValidationException");

module.exports = Object.freeze({
    CUSTOMER_REFUND: "CUSTOMER_REFUND",
    MERCHANT_TECHNICAL_PROBLEM: "MERCHANT_TECHNICAL_PROBLEM",
    REFUND_OBLIGINGNESS: "REFUND_OBLIGINGNESS",
    MERCHANT_CAN_NOT_DELIVER_GOODS: "MERCHANT_CAN_NOT_DELIVER_GOODS",
    constructFromObject: function (data) {
        if (data === null || data === undefined || this.hasOwnProperty(data)) {
            return data;
        }
        throw new ValidationException(`Could not find '${data}' in String.`);
    },
});
