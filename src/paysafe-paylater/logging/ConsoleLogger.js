const Logger = require("./Logger");

class ConsoleLogger extends Logger {
    static request(req) {
        console.log("Paysafe request: ", req);
    }

    static requestError(err) {
        console.error("Paysafe error request: ", err);
    }
    static response(resp) {
        console.log("Paysafe response: ", resp);
    }
    static responseError(err) {
        console.error("Paysafe error response: ", err);
    }
}

module.exports = ConsoleLogger;
