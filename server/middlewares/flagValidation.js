import { propertyChecker, ApiError } from '../helpers';

export default class FlagValidation {
  static validateFlag(req, res, next) {
    try {
      if (!propertyChecker(req.body, 'car_id', 'reason', 'description')) {
        throw new ApiError('Invalid Flag Form', 400);
      }
      return next();
    } catch (err) {
      return res.status(err.status).send(
        { status: err.status, message: err.message, success: err.success },
      );
    }
  }
}
