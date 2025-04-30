const BAD_REQUEST_STATUS_CODE = 400;
const UNAUTHORIZED_ERROR_STATUS_CODE = 401;
const NOT_FOUND_STATUS_CODE = 404;
const CONFLICT_ERROR_STATUS_CODE = 409;
const DEFAULT_ERROR_STATUS_CODE = 500;

class InvalidDataError extends Error {
  constructor(message) {
    super(message);
    this.status = UNAUTHORIZED_ERROR_STATUS_CODE;
    this.name = "InvalidDataError";
  }
}

module.exports = {
  BAD_REQUEST_STATUS_CODE,
  UNAUTHORIZED_ERROR_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  CONFLICT_ERROR_STATUS_CODE,
  DEFAULT_ERROR_STATUS_CODE,
  InvalidDataError
};
