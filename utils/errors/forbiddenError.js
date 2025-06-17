const { FORBIDDEN_STATUS_CODE } = require("./errors");

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.status = FORBIDDEN_STATUS_CODE;
    this.name = "ForbiddenError";
  }
}

module.exports = { ForbiddenError };
