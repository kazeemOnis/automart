import { Router } from 'express';
import UserValidation from '../middlewares/userValidation';
import UserController from '../controllers/userController';

const authRoutes = Router();

authRoutes.post('/signup', UserValidation.validateSignup, UserController.signup);
authRoutes.post('/signin', UserValidation.validateSignin, UserController.signin);

export default authRoutes;
