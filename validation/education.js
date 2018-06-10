const Validator = require("validator");
var isEmpty = require("./is-empty");

module.exports = function validateExperienceInput(data) {
  let errors = {};

  data.school = !isEmpty(data.school) ? data.school : "";
  data.degree = !isEmpty(data.degree) ? data.degree : "";
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  if (Validator.isEmpty(data.school)) {
    errors.school = "school field cannot be empty";
  }

  if (Validator.isEmpty(data.degree)) {
    errors.degree = "degree field cannot be empty";
  }

  if (Validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = "fieldofstudy field cannot be empty";
  }

  if (Validator.isEmpty(data.from)) {
    errors.from = "from field cannot be empty";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
