import { Router } from 'express';
import authRoutes from './authRoutes';
import carRoutes from './carRoutes';
import orderRoutes from './orderRoutes';


const routes = Router();
routes.use('/auth', authRoutes);
routes.use('/car', carRoutes);
routes.use('/order', orderRoutes);

export default routes;
