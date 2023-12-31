const { StatusCodes } = require("http-status-codes");

class ServiceError extends Error {
    constructor(
        message = "Something Went Wrong",
        explanation = "Service layer error",
        statusCode = StatusCodes.INTERNAL_SERVER_ERROR
    ) {
        super();
        this.name = "ServiceError";
        this.explanation = explanation;
        this.message = message;
        this.statusCode = statusCode;
    }
}
module.exports = ServiceError;