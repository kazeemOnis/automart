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
}
