const moxios = require("moxios");
const Communicator = require("../../src/paysafe-paylater/communication/Communicator");
const Connection = require("../../src/paysafe-paylater/connection/AxiosConnection");
const ValidationException = require("../../src/paysafe-paylater/exceptions/ValidationException");
const AuthorizationException = require("../../src/paysafe-paylater/exceptions/AuthorizationException");
const ReferenceException = require("../../src/paysafe-paylater/exceptions/ReferenceException");
const PaysafeException = require("../../src/paysafe-paylater/exceptions/PaysafeException");
const ApiException = require("../../src/paysafe-paylater/exceptions/ApiException");

describe("Communicator", () => {
    let communicator;

    beforeEach(() => {
        const connection = new Connection();
        communicator = new Communicator(connection);
        moxios.install(communicator.connection.axios);
    });
    afterEach(() => {
        moxios.uninstall(communicator.connection.axios);
    });

    describe("Authorization header", () => {
        test("it extracts Auth from headers", async () => {
            moxios.stubRequest("/something", {
                status: 200,
                headers: {
                    access_token: "blabla",
                },
            });
            const { authorization } = await communicator.executeWithAuthorizationHeader("GET", "/something");
            expect(authorization).toEqual("Bearer blabla");
        });
    });

    describe("Exceptions", () => {
        test("it throws ValidationException on 400 response status", async () => {
            moxios.stubRequest("/something", { status: 400, response: {} });
            const result = communicator.execute("GET", "/something");
            await expect(result).rejects.toThrow(ValidationException);
        });

        test("it throws AuthorizationException on 401 response status", async () => {
            moxios.stubRequest("/something", { status: 401, response: {} });
            const result = communicator.execute("GET", "/something");
            await expect(result).rejects.toThrow(AuthorizationException);
        });

        test("it throws AuthorizationException on 403 response status", async () => {
            moxios.stubRequest("/something", { status: 403, response: {} });
            const result = communicator.execute("GET", "/something");
            await expect(result).rejects.toThrow(AuthorizationException);
        });

        test("it throws ReferenceException on 404 response status", async () => {
            moxios.stubRequest("/something", { status: 404, response: {} });
            const result = communicator.execute("GET", "/something");
            await expect(result).rejects.toThrow(ReferenceException);
        });

        test("it throws ReferenceException on 409 response status", async () => {
            moxios.stubRequest("/something", { status: 409, response: {} });
            const result = communicator.execute("GET", "/something");
            await expect(result).rejects.toThrow(ReferenceException);
        });

        test("it throws ReferenceException on 410 response status", async () => {
            moxios.stubRequest("/something", { status: 410 });
            const result = communicator.execute("GET", "/something", { status: 410, response: {} });
            await expect(result).rejects.toThrow(ReferenceException);
        });

        test("it throws PaysafeException on 500 response status", async () => {
            moxios.stubRequest("/something", { status: 500, response: {} });
            const result = communicator.execute("GET", "/something");
            await expect(result).rejects.toThrow(PaysafeException);
        });

        test("it throws PaysafeException on 502 response status", async () => {
            moxios.stubRequest("/something", { status: 502, response: {} });
            const result = communicator.execute("GET", "/something");
            await expect(result).rejects.toThrow(PaysafeException);
        });

        test("it throws PaysafeException on 503 response status", async () => {
            moxios.stubRequest("/something", { status: 503 });
            const result = communicator.execute("GET", "/something");
            await expect(result).rejects.toThrow(PaysafeException);
        });

        test("it throws ApiException on any other response status", async () => {
            moxios.stubRequest("/something", { status: 418 });
            const result = communicator.execute("GET", "/something");
            await expect(result).rejects.toThrow(ApiException);
        });
    });
});
