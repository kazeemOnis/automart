import { propertyChecker, ApiError, regexChecker } from '../helpers';

const amountRegex = /^[\d]+$/;

export default class OrdrerValidation {
  static validateOrder(req, res, next) {
    try {
      const orderParameters = ['car_id', 'amount'];
      if (!propertyChecker(req.body, ...orderParameters)) {
        throw new ApiError('Invalid Order Provided', 400);
      }
      if (!regexChecker(amountRegex, req.body.amount)) {
        throw new ApiError('Invalid Amount, Please Enter Numbers Only', 400);
      }
      return next();
    } catch (err) {
      return res.status(err.status).send(
        { status: err.status, message: err.message, success: err.success },
      );
    }
  }
}
