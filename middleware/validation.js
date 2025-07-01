const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateUrl = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

module.exports.validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),

    weather: Joi.string().valid("hot", "warm", "cold").required(),

    imageUrl: Joi.string().required().custom(validateUrl).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
  }),
});

module.exports.validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateUrl).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'the "avatar" field must be a valid url',
    }),
    email: Joi.string().required().min(2).email().messages({
      "string.email": 'The "email" field must be a valid email address',
      "string.min": 'The minimum length of the "email" field is 5',
      "string.empty": 'The "email" field must be filled in',
    }),
    password: Joi.string().required().min(8).messages({
      "string.min": 'The minimum length of the "password" field is 8',
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

module.exports.validateUpdateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateUrl).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'the "avatar" field must be a valid url',
    }),
  }),
});

module.exports.validateLoginBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).email().messages({
      "string.email": 'The "email" field must be a valid email address',
      "string.min": 'The minimum length of the "email" field is 5',
      "string.empty": 'The "email" field must be filled in',
    }),
    password: Joi.string().required().min(8).messages({
      "string.min": 'The minimum length of the "password" field is 8',
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

module.exports.validateItemIdParam = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().alphanum().length(24).required().messages({
      "string.alphanum":
        'The "itemId" must be a 24-character alphanumeric string',
      "string.length": 'The "itemId" must be exactly 24 characters long',
      "any.required": 'The "itemId" parameter is required',
    }),
  }),
});
