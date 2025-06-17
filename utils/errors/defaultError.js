const { DEFAULT_ERROR_STATUS_CODE } = require("./errors");

class DefaultError extends Error {
  constructor(message) {
    super(message);
    this.status = DEFAULT_ERROR_STATUS_CODE;
    this.name = "DefaultError";
  }
}

module.exports = { DefaultError };