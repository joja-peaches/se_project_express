const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const {
  BAD_REQUEST_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  DEFAULT_ERROR_STATUS_CODE,
  CONFLICT_ERROR_STATUS_CODE,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res, next) => {
  const { name, email, password, avatar } = req.body;
  if (!email || !password) {
    return res
      .status(BAD_REQUEST_STATUS_CODE)
      .send({ message: "Email and password required" });
  }
  return User.findOne({ email }).then((existingUser) => {
    if (existingUser) {
      return res
        .status(CONFLICT_ERROR_STATUS_CODE)
        .send({ message: "Email already exists" });
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
          return res
            .status(BAD_REQUEST_STATUS_CODE)
            .send({ message: err.message });
        }
        if (err.code === 11000) {
          return res
            .status(CONFLICT_ERROR_STATUS_CODE)
            .send({ message: "Email already exists" });
        }
        return next(err);
      });
  });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(BAD_REQUEST_STATUS_CODE)
      .send({ message: "Email and password required" });
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
        return res.status(err.status).send({ message: err.message });
      }
      return next(err);
    });
};

const updateProfile = (req, res) => {
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
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_STATUS_CODE).send({ message: err.message });
      }
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: err.message });
      }
      return res
        .status(DEFAULT_ERROR_STATUS_CODE)
        .send({ message: err.message });
    });
};

const getCurrentUser = (req, res) => {
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
        return res.status(err.statusCode).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: err.message });
      }
      return res
        .status(DEFAULT_ERROR_STATUS_CODE)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = {
  createUser,
  login,
  updateProfile,
  getCurrentUser,
};
