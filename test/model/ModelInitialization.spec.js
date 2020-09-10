const SDK = require("../..");

const Amount = SDK.models.Amount;
const Currency = SDK.models.Currency;
const AuthorizePurchaseRequest = SDK.models.AuthorizePurchaseRequest;
const CapturePurchaseRequest = SDK.models.CapturePurchaseRequest;
const InitializePurchaseRequest = SDK.models.InitializePurchaseRequest;
const Payment = SDK.models.Payment;
const PaymentMethod = SDK.models.PaymentMethod;
const PaymentOption = SDK.models.PaymentOption;
const Person = SDK.models.Person;
const PurchaseInformation = SDK.models.PurchaseInformation;
const MethodType = SDK.models.MethodType;
const OperationResult = SDK.models.OperationResult;
const ValidationException = SDK.exceptions.ValidationException;

const nonDefaultAmount = new Amount(50, Currency.USD);

function fail() {
    expect(false).toBeTruthy();
}

/** @param {Amount} amount */
function validateAmount(amount) {
    expect(amount).toBeDefined();
    expect(amount.getAmount()).toEqual(100);
    expect(amount.getCurrency()).toEqual("EUR");
    expect(amount.currency).toEqual(Currency.EUR);
}

/** @param {InitializePurchaseRequest} request */
function validateRequest(request) {
    expect(request).toBeDefined();
    validateAmount(request.getPurchaseAmount());
}

/**
 *
 * @param {Function} funct
 * @param {string|RegExp} errorMessage
 */
function expectValidationError(funct, errorMessage) {
    try {
        fail(funct());
    } catch (e) {
        validateException(e, errorMessage);
    }
}

/**
 * @param {ValidationException} e
 * @param {RegExp} errorMessage
 */
function validateException(e, errorMessage) {
    expect(e).toBeInstanceOf(ValidationException);
    expect(e.message).toMatch(errorMessage);
}

describe("Models", () => {
    describe("can be constructed", () => {
        it("with primitives", () => {
            validateAmount(new Amount(100, "EUR"));
        });
        it("with an enum", () => {
            validateAmount(new Amount(100, Currency.EUR));
        });
        it("with a class", () => {
            validateRequest(new InitializePurchaseRequest(new Amount(100, "EUR")));
        });
        it("with an object", () => {
            validateRequest(new InitializePurchaseRequest({ amount: 100, currency: "EUR" }));
        });
        it("from an object", () => {
            validateAmount(Amount.constructFromObject({ amount: 100, currency: "EUR" }));
        });
    });

    describe("cannot be constructed", () => {
        it("with a wrong enum", () => {
            expectValidationError(() => new Amount(100, "CURR"), /string.*Currency/);
        });
        it("with a wrong number", () => {
            expectValidationError(() => new Amount("100", "EUR"), /string.*number/);
        });
        it("with a wrong string", () => {
            expectValidationError(() => new AuthorizePurchaseRequest(1, MethodType.SMS), /number.*string/);
        });
        it("with a wrong primitive as object", () => {
            expectValidationError(() => new InitializePurchaseRequest(100), /number.*Amount/);
        });
    });

    describe("can populate", () => {
        it("an integer with set", () => {
            const amount = new Amount(50, "EUR");
            amount.setAmount(100);
            validateAmount(amount);
        });
        it("a boolean with set(false)", () => {
            const request = new CapturePurchaseRequest();
            request.setClosePurchase(false);
            expect(request.getClosePurchase()).toEqual(false);
        });
        it("a boolean with set(true)", () => {
            const request = new CapturePurchaseRequest();
            request.setClosePurchase(true);
            expect(request.getClosePurchase()).toEqual(true);
        });
        it("a boolean with set(null)", () => {
            const request = new CapturePurchaseRequest();
            request.setClosePurchase(null);
            expect(request.getClosePurchase()).toBeNull();
        });
        it("a boolean with set()", () => {
            const request = new CapturePurchaseRequest();
            request.setClosePurchase();
            expect(request.getClosePurchase()).not.toBeDefined();
        });
        it("an enum with set(enum)", () => {
            const amount = new Amount(100, "USD");
            amount.setCurrency(Currency.EUR);
            validateAmount(amount);
        });
        it("an enum with set(string)", () => {
            const amount = new Amount(100, "USD");
            amount.setCurrency("EUR");
            validateAmount(amount);
        });
        it("an integer with with", () => {
            validateAmount(new Amount(50, "EUR").withAmount(100));
        });
        it("an enum with with(enum)", () => {
            validateAmount(new Amount(100, "USD").withCurrency(Currency.EUR));
        });
        it("an enum with with(string)", () => {
            const amount = new Amount(100, "USD").withCurrency("EUR");
            validateAmount(amount);
        });
        it("a class with a class", () => {
            new InitializePurchaseRequest(nonDefaultAmount).withPurchaseAmount(new Amount(100, "EUR"));
        });
        it(" a class with an object", () => {
            new InitializePurchaseRequest(nonDefaultAmount).withPurchaseAmount({ amount: 100, currency: "EUR" });
        });
    });

    describe("cannot be populated with a wrong", () => {
        it("enum", () => {
            expectValidationError(() => new Amount(100, "CURR"), /string.*should match.*Currency/);
        });
        it("number", () => {
            expectValidationError(() => new Amount("100", "EUR"), /100.*should be.*number/);
        });
        it("boolean (truthy)", () => {
            expectValidationError(() => new CapturePurchaseRequest().setClosePurchase("truthy"), /string.*should be.*boolean/);
        });
        it("boolean (falsy)", () => {
            expectValidationError(() => new CapturePurchaseRequest().setClosePurchase(0), /number.*should be.*boolean/);
        });
        it("string", () => {
            expectValidationError(() => new AuthorizePurchaseRequest(1, MethodType.SMS), /number.*should be.*string/);
        });
        it("primitive as object", () => {
            expectValidationError(() => new InitializePurchaseRequest(100), /number.*should be.*Amount/);
        });
    });

    describe("with dates", () => {
        it("format Date correctly", () => {
            let person = new Person().withBirthdate(new Date(2000, 0, 2));
            expect(JSON.stringify(person)).toEqual('{"birthdate":"2000-01-02"}');
        });
        it("allow ISO string", () => {
            let person = new Person().withBirthdate("2000-01-02");
            expect(person.getBirthdate()).toBeInstanceOf(Date);
            expect(JSON.stringify(person)).toEqual('{"birthdate":"2000-01-02"}');
        });
        it("allow non-ISO string", () => {
            let person = new Person()
                // Note that we expect the parser to use the MM-dd-YYYY format here. This can differ between systems.
                .withBirthdate("01-02-2000");
            expect(person.getBirthdate()).toBeInstanceOf(Date);
            expect(JSON.stringify(person)).toEqual('{"birthdate":"2000-01-02"}');
        });
        it("reject invalid strings", () => {
            expectValidationError(() => new Person().withBirthdate("abc"), /string.*should be.*Date/);
        });
        it("reject non-dates", () => {
            expectValidationError(() => new Person().withBirthdate(100), /number.*should be.*Date/);
        });
    });

    describe("with arrays", () => {
        it("allow arrays", () => {
            const payment = new Payment(),
                paymentOption = new PaymentOption();
            paymentOption.setPayments([payment]);
            expect(paymentOption.getPayments()).toBeDefined();
            expect(paymentOption.getPayments()[0]).toEqual(payment);
        });
        it("reject non-arrays", () => {
            expectValidationError(() => new PaymentOption().setPayments("notAnArray"), /string.*should be.*Array/);
        });
        it("reject non-object entries", () => {
            expectValidationError(() => new PaymentOption().setPayments(["notAnObject"]), /string.*should be.*Payment/);
        });
        it("allow adding to undefined arrays", () => {
            const payment = new Payment().withDueDate(new Date(2000, 1, 1)),
                paymentOption = new PaymentOption();
            paymentOption.addPayments(payment);
            expect(paymentOption.getPayments()).toBeDefined();
            expect(paymentOption.getPayments()).toHaveLength(1);
            expect(paymentOption.getPayments()[0].getDueDate().getFullYear()).toEqual(2000);
        });
        it("allow adding to existing arrays", () => {
            const payment1 = new Payment().withDueDate(new Date(2000, 1, 1)),
                payment2 = new Payment().withDueDate(new Date(2001, 1, 1)),
                paymentOption = new PaymentOption().withPayments([payment1]);
            paymentOption.addPayments(payment2);
            expect(paymentOption.getPayments()).toBeDefined();
            expect(paymentOption.getPayments()).toHaveLength(2);
            expect(paymentOption.getPayments()[0].getDueDate().getFullYear()).toEqual(2000);
            expect(paymentOption.getPayments()[1].getDueDate().getFullYear()).toEqual(2001);
        });
        it("reject adding invalid entries", () => {
            expectValidationError(() => new PaymentOption().addPayments("notAPayment"), /string.*should be.*Payment/);
        });
        it("allow adding valid enums", () => {
            const paymentOption = new PaymentOption();
            paymentOption.addSupportedPaymentMethods(PaymentMethod.DIRECT_DEBIT);
            expect(paymentOption.getSupportedPaymentMethods()).toBeDefined();
            expect(paymentOption.getSupportedPaymentMethods()).toHaveLength(1);
            expect(paymentOption.getSupportedPaymentMethods()[0]).toEqual(PaymentMethod.DIRECT_DEBIT);
        });
        it("allow adding valid enum strings", () => {
            const paymentOption = new PaymentOption();
            paymentOption.addSupportedPaymentMethods("DIRECT_DEBIT");
            expect(paymentOption.getSupportedPaymentMethods()).toBeDefined();
            expect(paymentOption.getSupportedPaymentMethods()).toHaveLength(1);
            expect(paymentOption.getSupportedPaymentMethods()[0]).toEqual(PaymentMethod.DIRECT_DEBIT);
        });
        it("reject adding invalid enum strings", () => {
            expectValidationError(
                () => new PaymentOption().addSupportedPaymentMethods("invalidMethod"),
                /string.*PaymentMethod/
            );
        });
        it("reject adding non-enums", () => {
            expectValidationError(
                () => new PaymentOption().addSupportedPaymentMethods(new Date()),
                /object.*PaymentMethod/
            );
        });
    });

    describe("with maps", () => {
        it("allow maps", () => {
            const purchaseInformation = new PurchaseInformation();
            purchaseInformation.setMetaData({ aKey: "aValue" });
            expect(purchaseInformation.getMetaData()).toBeDefined();
            expect(purchaseInformation.getMetaData()["aKey"]).toEqual("aValue");
        });
        it("reject non-maps", () => {
            expectValidationError(() => new PurchaseInformation().setMetaData("notAMap"), /string.*should be.*Map/);
        });
        it("reject invalid values", () => {
            expectValidationError(
                () => new PurchaseInformation().setMetaData({ aKey: new Date(2000, 0, 2) }),
                /object.*should be.*string/
            );
        });
        it("allow adding to undefined arrays", () => {
            const purchaseInformation = new PurchaseInformation();
            purchaseInformation.setMetaData({ aKey: "aValue" });
            purchaseInformation.addMetaData("aSecondKey", "aSecondValue");
        });
        it("reject adding invalid keys", () => {
            expectValidationError(
                () => new PurchaseInformation().addMetaData(new Date(2000, 0, 2), "aValue"),
                /object.*should be.*string/
            );
        });
        it("reject adding invalid values", () => {
            expectValidationError(
                () => new PurchaseInformation().addMetaData("aKey", new Date(2000, 0, 2)),
                /object.*should be.*string/
            );
        });
    });
});
