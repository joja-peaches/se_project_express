const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

router.post(
  "/posts",
  celebrate({
    body: Joi.object().keys({
      title: Joi.string().required().min(2).max(30),
      text: Joi.string().required().min(2),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().required().min(2).max(30),
      age: Joi.number().integer().required().min(18),
      about: Joi.string().min(2).max(30),
    }),
  }),
  createPost
);

router.delete('/:postId', celebrate({
  // validate parameters
  params: Joi.object().keys({
    postId: Joi.string().alphanum().length(24),
  }),
  headers: Joi.object().keys({
    // validate headers
  }),
  query: Joi.object().keys({
    // validate query
  }),
}), deletePost);

router.delete('/:postId', celebrate({
  headers: Joi.object().keys({
    // validate headers
  }).unknown(true),
}), deletePost);