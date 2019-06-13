import { Router } from 'express';
import userValidation from '../middlewares/userValidation';
import UserController from '../controllers/userController';

const userRoutes = Router();

userRoutes.post('/signup', userValidation.validateSignup, UserController.signup);

export default userRoutes;
