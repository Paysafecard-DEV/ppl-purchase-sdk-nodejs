const crypto = require("crypto");
const KeyObject = crypto.KeyObject;
const WebhookDecryptionException = require("./WebhookDecryptionException");
const PurchaseOperationResponse = require("../model/PurchaseOperationResponse");

const cipherAlgorithm = "aes-256-gcm";
const keyAlgorithm = "sha256";
const messageEncoding = "utf8";
const authTagLength = 16;

/**
 * Decrypts the given WebhookMessage or String using the given key.
 * @param {WebhookMessage|String} [message]
 * @param {KeyObject|String} secretKey
 */
function decrypt(message, secretKey) {
    const encryptedMessage = getMessageAsBuffer(message);
    const decipher = crypto.createDecipheriv(cipherAlgorithm, convertToKey(secretKey), extractIv(encryptedMessage));
    const encryptedText = extractEncryptedText(encryptedMessage);
    decipher.setAuthTag(getAuthTag(encryptedMessage));
    let data;
    try {
        data = JSON.parse(decipher.update(encryptedText, null, messageEncoding) + decipher.final(messageEncoding));
    } catch (e) {
        throw new WebhookDecryptionException(e);
    }
    return PurchaseOperationResponse.constructFromObject(data);
}

/**
 * Retrieve the encrypted content of a callback message and convert it to a buffer object.
 * @param {WebhookMessage|String} message
 * @returns {Buffer}
 */
const getMessageAsBuffer = function (message) {
    const encodedMessage =
        typeof message === "string"
            ? message
            : message.hasOwnProperty("infoResponseMessage")
            ? message.infoResponseMessage
            : undefined;
    if (encodedMessage === undefined) {
        throw new Error(`Could not find a message to decrypt in given message ${message}`);
    }
    return Buffer.from(encodedMessage, "base64");
};

const ivLength = 12;
/**
 * Extract the Initialization Vector from the encrypted message and validate the first byte.
 * @param {Buffer} encryptedMessage
 * @returns {Buffer}
 */
const extractIv = function (encryptedMessage) {
    const length = encryptedMessage[0];
    if (length !== ivLength) {
        throw new WebhookDecryptionException(`invalid iv length: ${length}. Message might be corrupt.`);
    }
    return encryptedMessage.slice(1, ivLength + 1);
};

/**
 * Hash the given key and wrap it in a Crypto KeyObject.
 * @param {String} secretKey
 * @returns {KeyObject}
 */
const convertToKey = function (secretKey) {
    if (secretKey instanceof KeyObject) {
        return secretKey;
    }
    // Convert the String key to a secure KeyObject.
    const hash = crypto.createHash(keyAlgorithm);
    return crypto.createSecretKey(hash.update(secretKey).digest());
};

/**
 * Extract the content by trimming the preceding IV and trailing auth tag.
 * @param {Buffer} encryptedMessage
 * @returns {Buffer}
 */
const extractEncryptedText = function (encryptedMessage) {
    // Extract the message from the complete buffer (minus IV at the start and authTag at the end).
    return encryptedMessage.slice(ivLength + 1, -authTagLength);
};

/**
 * Extract the auth tag.
 * @param {Buffer} encryptedMessage
 * @returns {Buffer}
 */
const getAuthTag = function (encryptedMessage) {
    // The last 16 bytes contain the auth tag of the message.
    return encryptedMessage.slice(-authTagLength);
};

module.exports = { decrypt };
