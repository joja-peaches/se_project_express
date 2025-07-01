const { DefaultError } = require("../utils/errors/defaultError");

const errorHandler = (err, req, res, next) => {
  if (err.status) {
    next(new DefaultError("An error has occurred on the server."));
  }
};

module.exports = { errorHandler };
