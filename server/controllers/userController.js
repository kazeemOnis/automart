import User from '../models/userModel';
import {
  ApiError, serverError, hashPassword, generateToken,
} from '../helpers/index';

export default class UserController {
  static async signup(req, res) {
    try {
      const userExists = User.checkEmailExist(req.body.email);
      if (userExists) {
        throw new ApiError('Email Already Exists', 400);
      }
      req.body.password = await hashPassword(req.body.password);
      const user = User.createUser(req.body);
      const {
        id, email, firstName, lastName, address, isAdmin,
      } = user;
      const token = await generateToken({ id, email });
      return res.status(201).send({
        status: 201,
        data: {
          id, firstName, lastName, email, address, isAdmin, token,
        },
        message: 'User Successfully Created',
        success: true,
      });
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
