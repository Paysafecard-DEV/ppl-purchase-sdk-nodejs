/**
 * Connection configuration
 * @typedef {Object} ConnectionConfig
 * @property {Number} baseURL  Set the instance baseURL
 * @property {String} timeout  Set a default timeout to the Connection instance
 * @property {Boolean} headers Add additional headers to Connection instance
 * @property {Logger} log      Log requests and responses.
 */

const axios = require("axios").default;
const BaseConnection = require("./BaseConnection");

class AxiosConnection extends BaseConnection {
    /**
     * Creates an instance of Communicator.
     * @memberOf AxiosConnection
     * @param {ConnectionConfig} [config]
     */
    constructor(config = {}) {
        super();

        this.axios = axios.create({
            baseURL: config.baseURL,
            timeout: config.timeout,
            headers: config.headers,
        });

        this.axios.interceptors.request.use(
            (request) => {
                obfuscateAndLogRequest(request, config.log);
                return request;
            },
            (error) => {
                obfuscateAndLogRequestError(error, config.log);
                this.handleRequestError(error);
                return Promise.reject(error);
            }
        );

        this.axios.interceptors.response.use(
            (response) => {
                obfuscateAndLogResponse(response, config.log);
                return response;
            },
            (error) => {
                obfuscateAndLogResponseError(error, config.log);
                this.handleResponseError(error, error.response.status);
                return Promise.reject(error);
            }
        );
    }

    /**
     * Execute an HTTP(s) request
     * @param method "GET", "POST" or "PUT" http method to use
     * @param uri path to request
     * @param headerParams parameters to be sent in http headers
     * @param bodyParam the body to send (javascript Object, converted to Json)
     * @returns On success: a Promise with .data, .status and headers. On error: an AxiosError
     */
    request(method, uri, headerParams, bodyParam) {
        return this.axios.request({
            method: method,
            url: uri,
            headers: headerParams,
            data: bodyParam,
        });
    }
}

function copyObject(obj) {
    return Object.assign({}, obj);
}

function obfuscateHeader(headers, headerName) {
    if (headers && headers[headerName]) headers[headerName] = "***";
}

function obfuscate(obj) {
    if (obj.data) obj.data = "{***}";
    if (obj.headers) {
        obj.headers = copyObject(obj.headers);
        obfuscateHeader(obj.headers, "access_token");
        obfuscateHeader(obj.headers, "Authorization");
        obfuscateHeader(obj.headers, "paysafe-pl-secret-key");
    }
}

function obfuscateAndLogRequest(request, log) {
    if (log && typeof log.request === "function") {
        const req = copyObject(request);
        obfuscate(req);
        log.request(req);
    }
}

function obfuscateAndLogRequestError(error, log) {
    if (log && typeof log.requestError === "function") {
        const err = copyObject(error);
        if (err.config) obfuscate(err.config);
        log.requestError(err);
    }
}

function obfuscateAndLogResponse(response, log) {
    if (log && typeof log.response === "function") {
        const resp = copyObject(response);
        obfuscate(resp);
        if (resp.config) delete resp.config;
        if (resp.request) delete resp.request;
        log.response(resp);
    }
}

function obfuscateAndLogResponseError(error, log) {
    if (log && typeof log.responseError === "function") {
        if (!error.response) {
            if (err.config) obfuscate(err.config);
            log.responseError(error);
        } else {
            const response = copyObject(error.response);
            // Remove the request data.
            if (response.config) delete response.config;
            if (response.request) delete response.request;
            log.responseError(response);
        }
    }
}

module.exports = AxiosConnection;
