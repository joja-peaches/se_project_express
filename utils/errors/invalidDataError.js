const { UNAUTHORIZED_ERROR_STATUS_CODE } = require("./errors");

class InvalidDataError extends Error {
  constructor(message) {
    super(message);
    this.status = UNAUTHORIZED_ERROR_STATUS_CODE;
    this.name = "InvalidDataError";
  }
}

module.exports = { InvalidDataError };
