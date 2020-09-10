class ApiException extends Error {
    constructor(message, responseStatus = null, operationResult = null) {
        super(message);
        this.operationResult = operationResult;
        this.responseStatus = responseStatus;
    }

    /**
     * Returns the operation result for the call that resulted in a non-200 http return status.
     *
     * @return {OperationResult}
     */
    getOperationResult() {
        return this.operationResult;
    }

    getResponseStatus() {
        return this.responseStatus;
    }
}

module.exports = ApiException;
