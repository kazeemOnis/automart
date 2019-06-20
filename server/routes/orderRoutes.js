import { Router } from 'express';
import OrdrerValidation from '../middlewares/orderValidation';
import AuthValidation from '../middlewares/authValidation';
import OrderController from '../controllers/orderController';


const orderRoutes = Router();

orderRoutes.post('/', AuthValidation.authorizeUser, OrdrerValidation.validateOrder, OrderController.create);
orderRoutes.patch('/:order_id/price', AuthValidation.authorizeUser, OrdrerValidation.validatePriceUpdate, OrderController.updatePrice);

export default orderRoutes;
