import { Router } from 'express';
import authRoutes from './authRoutes';
import carRoutes from './carRoutes';

const routes = Router();
routes.use('/auth', authRoutes);
routes.use('/car', carRoutes);

export default routes;
