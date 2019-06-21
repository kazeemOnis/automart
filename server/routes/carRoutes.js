import { Router } from 'express';
import CarValidation from '../middlewares/carValidation';
import CarController from '../controllers/carController';
import AuthValidation from '../middlewares/authValidation';
import { upload } from '../helpers/multer';

const carRoutes = Router();

carRoutes.post('/', upload, AuthValidation.authorizeUser, CarValidation.validateCar, CarController.create);
carRoutes.get('/:car_id', CarController.get);
carRoutes.patch('/:car_id/status', AuthValidation.authorizeUser, CarController.sell);
carRoutes.patch('/:car_id/price', AuthValidation.authorizeUser, CarValidation.validatePriceUpdate, CarController.updatePrice);

export default carRoutes;
