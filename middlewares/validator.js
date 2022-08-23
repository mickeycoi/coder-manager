const { sendResponse } = require("../helpers/utils");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const validators = {};

validators.validate = (validationArray) => async (req, res, next) => {
  await Promise.all(validationArray.map((validation) => validation.run(req)));
  const errors = validationResult(req);
  console.log("error", errors);
  if (errors.isEmpty()) return next();

  const message = errors
    .array()
    .map((error) => error.msg)
    .join(" & ");
  return sendResponse(res, 422, false, null, { message }, "Validation Error");
};

module.exports = validators;
