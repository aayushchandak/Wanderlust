const joi = require("joi");

const listingSchema = joi.object({
  listing: joi
    .object({
      title: joi.string().trim().required(),
      description: joi.string().max(500).required(),
      price: joi.number().min(0).required(),
      location: joi.string().required(),
      country: joi.string().required(),
      reviews: joi.array().items(joi.string().hex().length(24)),
      imageUrl: joi.string().allow("", null),
      owner: joi.string(),
    })
    .required(),
});

const reviewSchema = joi.object({
  review: joi
    .object({
      rating: joi.number().required().min(1).max(5),
      comment: joi.string().required(),
    })
    .required(),
});

const userSchema = joi.object({
  username: joi.string().min(3).max(30).required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

module.exports = {
  listingSchema,
  reviewSchema,
  userSchema,
};
