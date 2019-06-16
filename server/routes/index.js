import { Router } from 'express';
import userRoutes from './userRoutes';
import carRoutes from './carRoutes';

const routes = Router();
routes.use('/user', userRoutes);
routes.use('/car', carRoutes);

export default routes;
