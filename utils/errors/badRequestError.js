const { BAD_REQUEST_STATUS_CODE } = require("./errors");

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.status = BAD_REQUEST_STATUS_CODE;
    this.name = "BadRequestError";
  }
}

module.exports = { BadRequestError };
