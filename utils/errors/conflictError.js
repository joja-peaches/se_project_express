const { CONFLICT_ERROR_STATUS_CODE } = require("./errors");

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.status = CONFLICT_ERROR_STATUS_CODE;
    this.name = "ConflictError";
  }
}

module.exports = { ConflictError };
