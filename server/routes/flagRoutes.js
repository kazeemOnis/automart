import { Router } from 'express';
import FlagValidation from '../middlewares/flagValidation';
import FlagController from '../controllers/flagContoller';

const flagRoutes = Router();

flagRoutes.post('/', FlagValidation.validateFlag, FlagController.create);

export default flagRoutes;
