const { DefaultError } = require("../utils/errors/defaultError");

const errorHandler = (err, req, res, next) => {
  console.error(err);
  if (err.status) {
    return res.status(err.status).send({ message: err.message });
  } else {
    next(new DefaultError("An error has occurred on the server."));
  }
};

module.exports = { errorHandler };
