const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const validator = require("validator");
const { NotFoundDataError } = require("../utils/errors/notFoundDataError");
const { InvalidDataError } = require("../utils/errors/invalidDataError");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 40 },

  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "You must enter a valid email",
    },
  },

  password: {
    type: String,
    required: true,
    select: false,
  },

  avatar: {
    type: String,
    required: [true, "The avatar field is required"],
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new NotFoundDataError("Email not registered")
        );
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new InvalidDataError("Incorrect email or password")
          );
        }
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
