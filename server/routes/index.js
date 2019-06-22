import { Router } from 'express';
import authRoutes from './authRoutes';
import carRoutes from './carRoutes';
import orderRoutes from './orderRoutes';
import flagRoutes from './flagRoutes';


const routes = Router();
routes.use('/auth', authRoutes);
routes.use('/car', carRoutes);
routes.use('/order', orderRoutes);
routes.use('/flag', flagRoutes);

export default routes;
