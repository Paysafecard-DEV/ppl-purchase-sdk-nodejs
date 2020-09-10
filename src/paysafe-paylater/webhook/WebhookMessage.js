/**
 * Purchase API
 * @copyright Copyright (c) 2020 Paysafe Pay Later
 * @license see LICENSE.TXT
 */

/**
 * Properties of a callback Webhook message.
 */
class WebhookMessage {
    constructor() {}

    getInfoResponseMessage() {
        return this.infoResponseMessage;
    }
    setInfoResponseMessage(val) {
        this.infoResponseMessage = val;
    }
    withInfoResponseMessage(val) {
        this.setInfoResponseMessage(val);
        return this;
    }

    static constructFromObject(data) {
        if (!data) {
            return;
        }
        let webhookMessage = new WebhookMessage();
        webhookMessage.setInfoResponseMessage(data["infoResponseMessage"]);
        return webhookMessage;
    }
}

module.exports = WebhookMessage;
