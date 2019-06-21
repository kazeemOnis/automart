import User from '../models/userModel';
import {
  ApiError, hashPassword, generateToken, comparePassword,
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
      const token = await generateToken({ id, email, isAdmin });
      return res.status(201).send({
        status: 201,
        data: {
          id, firstName, lastName, email, address, token,
        },
        message: 'User Successfully Created',
        success: true,
      });
    } catch (err) {
      return res.status(err.status).send(
        { status: err.status, message: err.message, success: err.success },
      );
    }
  }

  static async signin(req, res) {
    try {
      const user = User.findByEmail(req.body.email);
      if (user === null || user === undefined) {
        throw new ApiError('User Doesn\'t Exist, Check Email', 400);
      }
      const {
        id, password, email, firstName, lastName, isAdmin, address,
      } = user;
      const validPassword = await comparePassword(req.body.password, password);
      if (!validPassword) {
        throw new ApiError('Password Invalid', 401);
      }
      const token = await generateToken({ id, email, isAdmin });
      return res.status(200).send({
        status: 200,
        data: {
          id, firstName, lastName, email, address, token,
        },
        success: true,
      });
    } catch (err) {
      return res.status(err.status).send(
        { status: err.status, message: err.message, success: err.success },
      );
    }
  }
}
