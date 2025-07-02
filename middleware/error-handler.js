const { DEFAULT_ERROR_STATUS_CODE } = require("../utils/errors/errors");

const errorHandler = (err, req, res, next) => {
  if (err.status) {
    return res.status(err.status).send({ message: err.message });
  }
  return res
    .status(DEFAULT_ERROR_STATUS_CODE)
    .send({ message: "An error has occurred on the server." });
};
module.exports = { errorHandler };