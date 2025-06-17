const { NOT_FOUND_STATUS_CODE } = require("./errors");

class NotFoundDataError extends Error {
  constructor(message) {
    super(message);
    this.status = NOT_FOUND_STATUS_CODE;
    this.name = "NotFoundDataError";
  }
}

module.exports = { NotFoundDataError };
