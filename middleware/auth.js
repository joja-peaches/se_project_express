const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { InvalidDataError } = require("../utils/errors/invalidDataError");

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    next(new InvalidDataError("Authorization required"));
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new InvalidDataError("Authorization required"));
  }

  req.user = payload;
  return next();
};

module.exports = auth;