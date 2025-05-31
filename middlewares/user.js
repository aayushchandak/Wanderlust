const ExpressError = require("../utils/ExpressError");

const { userSchema } = require("../Schema");

const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

const saveRedirectUrl = (req, res, next) => {
  res.locals.redirectUrl = req.session.redirectUrl;
  // console.log(res.locals.redirectUrl);
  next();
};

module.exports = { validateUser, saveRedirectUrl };
