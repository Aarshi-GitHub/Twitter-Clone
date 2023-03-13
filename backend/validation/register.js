const Validator = require("validator");
module.exports = function (data) {
  let errors = {};
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }
  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }
  if (Validator.isEmpty(data.username)) {
    errors.username = "Username field is required";
  }
  if (!Validator.isLength(data.username, { min: 6, max: 30 })) {
    errors.username = "Username must be between 6 to 30 characters long";
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be between 6 to 30 characters long";
  }
  if (Validator.isEmpty(data.confirmPassword)) {
    errors.confirmPassword = "Confirm Password field is required";
  }
  if (!Validator.equals(data.password, data.confirmPassword)) {
    errors.confirmPassword = "Confirm Password must be equal to password";
  }
  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};
