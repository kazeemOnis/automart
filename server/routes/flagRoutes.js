import { Router } from 'express';
import FlagValidation from '../middlewares/flagValidation';
import FlagController from '../controllers/flagContoller';
import AuthValidation from '../middlewares/authValidation';

const flagRoutes = Router();

flagRoutes.post('/', FlagValidation.validateFlag, FlagController.create);
flagRoutes.get('/', AuthValidation.authorizeUser, AuthValidation.authorizeAdmin, FlagController.getAll);
flagRoutes.get('/:flag_id', AuthValidation.authorizeUser, AuthValidation.authorizeAdmin, FlagController.get);

export default flagRoutes;
