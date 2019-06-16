import { Router } from 'express';
import UserValidation from '../middlewares/userValidation';
import UserController from '../controllers/userController';

const userRoutes = Router();

userRoutes.post('/signup', UserValidation.validateSignup, UserController.signup);
userRoutes.post('/signin', UserValidation.validateSignin, UserController.signin);

export default userRoutes;
