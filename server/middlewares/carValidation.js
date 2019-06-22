import {
  propertyChecker, ApiError, regexChecker,
} from '../helpers';

const priceRegex = /^[\d]+$/;
const yearRegex = /^(19|20)\d{2}$/;

export default class CarValidation {
  static validateCar(req, res, next) {
    try {
      const carParameters = ['price', 'body_type', 'state', 'manufacturer', 'model', 'description', 'year'];
      if (!propertyChecker(req.body, ...carParameters)) {
        throw new ApiError('Invalid Car Provided', 400);
      }
      if (!regexChecker(priceRegex, req.body.price)) {
        throw new ApiError('Incorrect Price, Please Enter Numbers Only', 400);
      }
      if (!regexChecker(yearRegex, req.body.year)) {
        throw new ApiError('Incorrect Year Entered, Please Check', 400);
      }
      return next();
    } catch (err) {
      return res.status(err.status).send(
        { status: err.status, message: err.message, success: err.success },
      );
    }
  }

  static validatePriceUpdate(req, res, next) {
    try {
      const updateParamter = ['price'];
      if (!propertyChecker(req.body, ...updateParamter)) {
        throw new ApiError('Invalid Update Form', 400);
      }
      if (!regexChecker(priceRegex, req.body.price)) {
        throw new ApiError('Invalid Price, Please Enter Numbers Only', 400);
      }
      return next();
    } catch (err) {
      return res.status(err.status).send(
        { status: err.status, message: err.message, success: err.success },
      );
    }
  }

  static validateQuery(req, res, next) {
    try {
      let result = true;
      const queryParameters = ['status', 'body_type', 'state', 'manufacturer', 'model', 'year', 'min_price', 'max_price'];
      const keys = Object.keys(req.query);
      for (let i = 0; i < keys.length; i += 1) {
        result = false;
        for (let j = 0; j < queryParameters.length; j += 1) {
          if (keys[i] === queryParameters[j]) {
            result = true;
            break;
          }
        }
      }
      if (result === false) {
        throw new ApiError('Invalid Query', 400);
      }
      return next();
    } catch (err) {
      return res.status(err.status).send(
        { status: err.status, message: err.message, success: err.success },
      );
    }
  }
}
