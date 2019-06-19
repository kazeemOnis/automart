import { Router } from 'express';
import OrdrerValidation from '../middlewares/orderValidation';
import AuthValidation from '../middlewares/authValidation';
import OrderController from '../controllers/orderController';


const orderRoutes = Router();

orderRoutes.post('/', AuthValidation.authorizeUser, OrdrerValidation.validateOrder, OrderController.create);

export default orderRoutes;
