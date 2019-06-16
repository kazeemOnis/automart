import { ApiError, authError, verifyToken } from '../helpers';

export default class AuthValidation {
  static async authorizeUser(req, res, next) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        throw new ApiError('No Authorization Token Provided', 401);
      }
      const bearer = await verifyToken(token);
      req.user = bearer;
      return next();
    } catch (err) {
      if (err.name === 'ApiError') {
        return res.status(err.status).send(
          { status: err.status, message: err.message, success: err.success },
        );
      }
      return res.status(authError.status).send(authError);
    }
  }
}
