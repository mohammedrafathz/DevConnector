const Validator = require("validator");
var isEmpty = require("./is-empty");

module.exports = function validateProfileInput(data) {
  let errors = {};

  data.handle = !isEmpty(data.handle) ? data.handle : "";
  data.status = !isEmpty(data.status) ? data.status : "";
  data.skills = !isEmpty(data.skills) ? data.skills : "";

  if (!Validator.isLength(data.handle, { min: 2, max: 30 })) {
    errors.handle = "handle must be between 2 and 40 characters";
  }

  if (Validator.isEmpty(data.handle)) {
    errors.handle = "handle field cannot be empty";
  }

  if (Validator.isEmpty(data.status)) {
    errors.status = "status field cannot be empty";
  }

  if (Validator.isEmpty(data.skills)) {
    errors.skills = "skills field cannot be empty";
  }

  if (!isEmpty(data.website)) {
    if (!Validator.isURL(data.website)) {
      errors.website = "Not is valid url";
    }
  }

  
  if (!isEmpty(data.youtube)) {
    if (!Validator.isURL(data.youtube)) {
      errors.youtube = "Not is valid url";
    }
  }
  
  if (!isEmpty(data.twitter)) {
    if (!Validator.isURL(data.twitter)) {
      errors.twitter = "Not is valid url";
    }
  }
  
  if (!isEmpty(data.facebook)) {
    if (!Validator.isURL(data.facebook)) {
      errors.facebook = "Not is valid url";
    }
  }
  
  if (!isEmpty(data.linkedin)) {
    if (!Validator.isURL(data.linkedin)) {
      errors.linkedin = "Not is valid url";
    }
  }
  
  if (!isEmpty(data.instagram)) {
    if (!Validator.isURL(data.instagram)) {
      errors.instagram = "Not is valid url";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
