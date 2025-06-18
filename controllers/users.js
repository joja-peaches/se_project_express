const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const {BadRequestError} = require("../utils/errors/badRequestError");
const {NotFoundDataError} = require("../utils/errors/notFoundDataError");
const {DefaultError} = require("../utils/errors/defaultError");
const {ConflictError} = require("../utils/errors/conflictError");

const { JWT_SECRET } = require("../utils/config");
const { InvalidDataError } = require("../utils/errors/invalidDataError");

const createUser = (req, res, next) => {
  const { name, email, password, avatar } = req.body;
  if (!email || !password) {
    next(new BadRequestError("Email and password required"));
  }
  return User.findOne({ email }).then((existingUser) => {
    if (existingUser) {
      next(new ConflictError("Email already exists"));
    }
    return bcrypt
      .hash(password, 10)
      .then((hash) => User.create({ name, email, password: hash, avatar }))
      .then((user) => {
        res.status(201).send({
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        });
      })
      .catch((err) => {
        if (err.name === "ValidationError") {
          next(new BadRequestError(err.message));
        } else if (err.code === 11000) {
          next(new ConflictError("Email already exists"));
        } else {
          next(new DefaultError(err.message));
        }
      });
  });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new BadRequestError("Email and password required"));
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(200).send({ token });
    })
    .catch((err) => {
      if (err.name === "InvalidDataError") {
        next(new InvalidDataError(err.message));
      } else if (err.name === "NotFoundDataError") {
        next(new InvalidDataError(err.message));
      } else {
        next(new DefaultError(err.message));
      }
    });
};

const updateProfile = (req, res, next) => {
  const { avatar, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar, name },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError(err.message));
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundDataError(err.message));
      } else if (err.name === "ValidationError") {
        next(new BadRequestError(err.message));
      } else {
        next(new DefaultError("An error has occurred on the server."));
      }
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      const error = new Error("ID not found");
      error.statusCode = NOT_FOUND_STATUS_CODE;
      throw error;
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.statusCode) {
        next(new NotFoundDataError(err.message));
      } else if (err.name === "CastError") {
        next(new BadRequestError(err.message));
      } else {
        next(new DefaultError("An error has occurred on the server."));
      }
    });
};

module.exports = {
  createUser,
  login,
  updateProfile,
  getCurrentUser,
};
