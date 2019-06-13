import {
  propertyChecker, ApiError, serverError, regexChecker,
} from '../helpers/index';

const nameRegex = /[a-zA-z]+/;
const emailRegex = /^[\w]+@[a-z]+\.[a-z]+$/;
const passwordRegex = /^\S{6,}$/;

export default class UserValidation {
  static validateSignup(req, res, next) {
    try {
      const userParameters = ['firstName', 'email', 'password', 'lastName', 'address'];
      const {
        firstName, lastName, email, password,
      } = req.body;
      const validProperties = propertyChecker(req.body, ...userParameters);
      if (!validProperties) {
        throw new ApiError('Invalid SignUp Form', 401);
      }
      if (!regexChecker(nameRegex, firstName.trim()) || !regexChecker(nameRegex, lastName.trim())) {
        throw new ApiError('Fisrtname or Lastname Invalid', 400);
      }
      if (!regexChecker(emailRegex, email.toLowerCase().trim())) {
        throw new ApiError('Invalid Email', 400);
      }
      if (!regexChecker(passwordRegex, password)) {
        throw new ApiError('Password must be 6 characters or more', 400);
      }
      return next();
    } catch (err) {
      if (err.name === 'ApiError') {
        return res.status(err.status).send(
          { status: err.status, message: err.message, success: err.success },
        );
      }
      return res.status(serverError.status).send(serverError);
    }
  }
}
